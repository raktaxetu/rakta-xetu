import mongoose, { Schema } from "mongoose";
import { IBlood } from "../../../types/schema";

const BloodSchema = new Schema<IBlood>(
  {
    bloodGroup: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
      required: true,
    },
    patientEmail: {
      type: String,
      required: [true, "patient email is required"],
    },
    patientName: {
      type: String,
      required: [true, "Patient name is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      match: [/^\+?[0-9]{10,15}$/, "Please provide a valid phone number"],
    },
    age: {
      type: Number,
      required: [true, "Age is required"],
      min: [0, "Age cannot be negative"],
    },
    units: {
      type: Number,
      required: [true, "Units required"],
      min: [1, "At least 1 unit is required"],
    },
    location: {
      type: String,
      required: [true, "Location is required"],
    },
    isCritical: {
      type: Boolean,
      default: false,
    },
    isAccepted: {
      type: Boolean,
      default: false,
    },
    notes: {
      type: String,
      required: true,
    },
    acceptedBy: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { timestamps: true }
);

export const Blood =
  mongoose.models?.Blood || mongoose.model<IBlood>("Blood", BloodSchema);
