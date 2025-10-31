import nodemailer from "nodemailer";
import {
  WELCOME_EMAIL_TEMPLATE,
  NEWS_SUMMARY_EMAIL_TEMPLATE,
  STOCK_ALERT_UPPER_EMAIL_TEMPLATE,
  STOCK_ALERT_LOWER_EMAIL_TEMPLATE,
} from "./templates";

export const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.NODEMAILER_EMAIL!,
    pass: process.env.NODEMAILER_PASSWORD!,
  },
});

export const sendWelcomeEmail = async ({
  email,
  name,
  intro,
}: WelcomeEmailData) => {
  const htmlTemplate = WELCOME_EMAIL_TEMPLATE.replace("{{name}}", name).replace(
    "{{intro}}",
    intro
  );

  const mailOptions = {
    from: `"FinPulse-AI" <safalyaroy9463@gmail.com>`,
    to: email,
    subject: `Welcome to FinPulse AI - your stock market toolkit is ready`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const sendAlertEmail = async ({
  type,
  email,
  symbol,
  company,
  targetPrice,
  currentPrice,
  previousPrice,
  timestamp,
}: {
  type: "upper" | "lower";
  email: string;
  symbol: string;
  company: string;
  targetPrice: string;
  currentPrice: string;
  previousPrice: string;
  timestamp: string;
}): Promise<void> => {
  const template =
    type === "upper"
      ? STOCK_ALERT_UPPER_EMAIL_TEMPLATE
      : STOCK_ALERT_LOWER_EMAIL_TEMPLATE;

  const htmlTemplate = template
    .replace(/{{symbol}}/g, symbol)
    .replace(/{{company}}/g, company)
    .replace(/{{targetPrice}}/g, targetPrice)
    .replace(/{{currentPrice}}/g, currentPrice)
    .replace(/{{previousPrice}}/g, previousPrice)
    .replace(/{{timestamp}}/g, timestamp);

  const mailOptions = {
    from: `"FinPulse Alerts" <safalyaroy9463@gmail.com>`,
    to: email,
    subject: `🔔 ${
      type === "upper" ? "Price Exceeded" : "Price Dropped"
    }: ${symbol} ${currentPrice}`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};

export const sendNewsSummaryEmail = async ({
  email,
  date,
  newsContent,
}: {
  email: string;
  date: string;
  newsContent: string;
}): Promise<void> => {
  const htmlTemplate = NEWS_SUMMARY_EMAIL_TEMPLATE.replace(
    "{{date}}",
    date
  ).replace("{{newsContent}}", newsContent);

  const mailOptions = {
    from: `"Signalist News" <signalist@jsmastery.pro>`,
    to: email,
    subject: `📈 Market News Summary Today - ${date}`,
    text: `Today's market news summary from Signalist`,
    html: htmlTemplate,
  };

  await transporter.sendMail(mailOptions);
};
