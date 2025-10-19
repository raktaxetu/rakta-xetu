import mongoose from "mongoose";
import { IProfile } from "../../../types/schema";

const profileSchema = new mongoose.Schema<IProfile>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    phoneNumber: {
      type: String,
      required: [true, "phone number is required"],
      match: [
        /^\+?[0-9]{1,4}?[-.\s]?(\(?\d{2,4}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{3,4}$/,
        "phone number is invalid",
      ],
    },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      required: [true, "gender is required"],
    },
    dateOfBirth: {
      type: String,
      required: [true, "dob is required"],
    },
    location: {
      type: String,
      required: [true, "location is required"],
    },
    bloodGroup: {
      type: String,
      required: [true, "blood group is required"],
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"],
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true }
);

const Profile =
  mongoose.models?.Profile ||
  mongoose.model<IProfile>("Profile", profileSchema);

export default Profile;
