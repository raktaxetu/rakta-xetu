import mongoose from "mongoose";
import { IDonation } from "../../../types/schema";

const donationSchema = new mongoose.Schema<IDonation>(
  {
    amount: {
      type: Number,
      required: true,
    },
    orderId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
      required: true,
    },
    currency: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const Donation =
  mongoose.models?.Donation ||
  mongoose.model<IDonation>("Donation", donationSchema);

export default Donation;
