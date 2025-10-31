"use server";

import { connectToDatabase } from "@/database/mongoose";
import { Alert } from "@/database/models/alert.model";
import { revalidatePath } from "next/cache";
import { auth } from "../better-auth/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getStocksDetails } from "./finnhub.actions";

// Get all alerts for a user
export const getUserAlerts = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect("/sign-in");

    const alerts = await Alert.find({ userId: session.user.id })
      .sort({ createdAt: -1 })
      .lean();

    // Serialize MongoDB documents and transform _id to id
    return alerts.map((alert) => ({
      id: alert._id.toString(),
      userId: alert.userId,
      symbol: alert.symbol,
      company: alert.company,
      alertName: alert.alertName,
      alertType: alert.alertType,
      threshold: alert.threshold,
      currentPrice: alert.currentPrice,
      createdAt: alert.createdAt?.toISOString(),
      updatedAt: alert.updatedAt?.toISOString(),
    }));
  } catch (error) {
    console.error("Error fetching alerts:", error);
    throw new Error("Failed to fetch alerts");
  }
};

// Create a new alert
export const createAlert = async (
  symbol: string,
  company: string,
  alertName: string,
  alertType: "upper" | "lower",
  threshold: number
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect("/sign-in");

    // Get current stock price
    const stockData = await getStocksDetails(symbol);
    if (!stockData || !stockData.currentPrice) {
      throw new Error("Unable to fetch current stock price");
    }

    // Check if an alert with the same type already exists for this stock
    const existingAlert = await Alert.findOne({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      alertType,
    });

    if (existingAlert) {
      return {
        success: false,
        error: `${alertType} alert already exists for this stock`,
      };
    }

    // Create new alert
    const newAlert = new Alert({
      userId: session.user.id,
      symbol: symbol.toUpperCase(),
      company: company.trim(),
      alertName,
      alertType,
      threshold,
      currentPrice: stockData.currentPrice,
    });

    await newAlert.save();
    revalidatePath("/watchlist");

    return { success: true, message: "Alert created successfully" };
  } catch (error) {
    console.error("Error creating alert:", error);
    throw new Error("Failed to create alert");
  }
};

// Update an existing alert
export const updateAlert = async (
  alertId: string,
  updates: {
    alertName?: string;
    alertType?: "upper" | "lower";
    threshold?: number;
  }
) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect("/sign-in");

    // Get current stock price
    const alert = await Alert.findOne({
      _id: alertId,
      userId: session.user.id,
    });

    if (!alert) {
      return { success: false, error: "Alert not found" };
    }

    const stockData = await getStocksDetails(alert.symbol);
    if (!stockData || !stockData.currentPrice) {
      throw new Error("Unable to fetch current stock price");
    }

    // Update alert
    const updatedAlert = await Alert.findOneAndUpdate(
      { _id: alertId, userId: session.user.id },
      { ...updates, currentPrice: stockData.currentPrice },
      { new: true }
    );

    if (!updatedAlert) {
      return { success: false, error: "Alert not found" };
    }

    revalidatePath("/watchlist");
    return { success: true, message: "Alert updated successfully" };
  } catch (error) {
    console.error("Error updating alert:", error);
    throw new Error("Failed to update alert");
  }
};

// Delete an alert
export const deleteAlert = async (alertId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) redirect("/sign-in");

    await Alert.deleteOne({
      _id: alertId,
      userId: session.user.id,
    });

    revalidatePath("/watchlist");
    return { success: true, message: "Alert deleted successfully" };
  } catch (error) {
    console.error("Error deleting alert:", error);
    throw new Error("Failed to delete alert");
  }
};
