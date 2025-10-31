import { Schema, model, models, type Document, type Model } from "mongoose";

export interface AlertItem extends Document {
  id: string;
  userId: string;
  symbol: string;
  company: string;
  alertName: string;
  alertType: "upper" | "lower";
  threshold: number;
  currentPrice: number;
  createdAt: Date;
  updatedAt: Date;
}

const AlertSchema = new Schema<AlertItem>(
  {
    userId: { type: String, required: true, index: true },
    symbol: { type: String, required: true, uppercase: true, trim: true },
    company: { type: String, required: true, trim: true },
    alertName: { type: String, required: true },
    alertType: { type: String, required: true, enum: ["upper", "lower"] },
    threshold: { type: Number, required: true },
    currentPrice: { type: Number, required: true },
  },
  { timestamps: true }
);

// Create a compound index for unique alerts per user and symbol
AlertSchema.index({ userId: 1, symbol: 1, alertType: 1 }, { unique: true });

export const Alert: Model<AlertItem> =
  (models?.Alert as Model<AlertItem>) || model<AlertItem>("Alert", AlertSchema);
