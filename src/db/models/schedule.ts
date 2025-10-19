import mongoose from "mongoose";
import { ISchedule } from "../../../types/schema";

const scheduleSchema = new mongoose.Schema<ISchedule>(
  {
    hospitalName: {
      type: String,
      required: [true, "hospital name is required"],
    },
    startAt: {
      type: Date,
      required: [true, "starting time is required"],
      validate: {
        validator: function (date: Date) {
          return date > new Date();
        },
        message: "date must be in the future",
      },
    },
    endAt: {
      type: Date,
      required: true,
    },
    googleEventId: {
      type: String,
      required: true,
    },
    confirmationEmailSent: {
      type: Boolean,
      default: false,
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

const Schedule =
  mongoose.models?.Schedule ||
  mongoose.model<ISchedule>("Schedule", scheduleSchema);

export default Schedule;
