import { inngest } from "@/lib/inngest/client";
import { Alert } from "@/database/models/alert.model";
import { getStocksDetails } from "@/lib/actions/finnhub.actions";
import { sendAlertEmail } from "@/lib/nodemailer";
import { formatPrice, getFormattedTodayDate } from "@/lib/utils";

export const checkPriceAlerts = inngest.createFunction(
  { id: "check-price-alerts" },
  [{ event: "app/check.alerts" }, { cron: "* * * * *" }], // Check every 15 minutes
  async ({ step }) => {
    // Get all alerts with their user info
    const alerts = await step.run("get-all-alerts", async () => {
      const mongoose = await import("@/database/mongoose").then((mod) =>
        mod.connectToDatabase()
      );
      const db = mongoose.connection.db;
      if (!db) throw new Error("MongoDB connection not connected");

      const aggregation = await Alert.aggregate([
        {
          $lookup: {
            from: "user",
            localField: "userId",
            foreignField: "id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            symbol: 1,
            company: 1,
            alertName: 1,
            alertType: 1,
            threshold: 1,
            currentPrice: 1,
            "user.email": 1,
            "user.name": 1,
          },
        },
      ]).exec();

      return aggregation;
    });

    if (!alerts || alerts.length === 0) {
      return { success: true, message: "No alerts to check" };
    }

    // Group alerts by symbol to minimize API calls
    const alertsBySymbol = alerts.reduce(
      (acc: { [key: string]: typeof alerts }, alert) => {
        if (!acc[alert.symbol]) {
          acc[alert.symbol] = [];
        }
        acc[alert.symbol].push(alert);
        return acc;
      },
      {}
    );

    // Check each group of alerts
    const triggeredAlerts: any[] = [];
    await step.run("check-alerts", async () => {
      for (const [symbol, symbolAlerts] of Object.entries(alertsBySymbol)) {
        try {
          const stockData = await getStocksDetails(symbol);
          if (!stockData || !stockData.currentPrice) continue;

          for (const alert of symbolAlerts) {
            const isTriggered =
              alert.alertType === "upper"
                ? stockData.currentPrice >= alert.threshold
                : stockData.currentPrice <= alert.threshold;

            if (isTriggered) {
              triggeredAlerts.push({
                ...alert,
                currentPrice: stockData.currentPrice,
                previousPrice: alert.currentPrice,
              });

              // Update current price in database
              await Alert.updateOne(
                { _id: alert._id },
                { currentPrice: stockData.currentPrice }
              );
            }
          }
        } catch (error) {
          console.error(`Error checking alerts for ${symbol}:`, error);
        }
      }
    });

    // Send alert emails
    if (triggeredAlerts.length > 0) {
      await step.run("send-alert-emails", async () => {
        const date = getFormattedTodayDate();

        for (const alert of triggeredAlerts) {
          try {
            await sendAlertEmail({
              type: alert.alertType,
              email: alert.user.email,
              symbol: alert.symbol,
              company: alert.company,
              targetPrice: formatPrice(alert.threshold),
              currentPrice: formatPrice(alert.currentPrice),
              previousPrice: formatPrice(alert.previousPrice),
              timestamp: date,
            });
          } catch (error) {
            console.error(
              `Error sending alert email for ${alert.symbol}:`,
              error
            );
          }
        }
      });
    }

    return {
      success: true,
      alertsChecked: alerts.length,
      alertsTriggered: triggeredAlerts.length,
    };
  }
);


