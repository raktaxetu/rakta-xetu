import mongoose from "mongoose";

interface IProfile {
  _id?: mongoose.Types.ObjectId;
  name: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  location: string;
  bloodGroup: string;
  userId?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IBlood {
  _id?: mongoose.Types.ObjectId;
  bloodGroup: string;
  patientEmail?: string;
  patientName: string;
  gender: string;
  phoneNumber: string;
  age: number;
  units: number;
  location: string;
  isCritical: boolean;
  isAccepted: boolean;
  notes: string;
  acceptedBy?: mongoose.Schema.Types.ObjectId;
  userId?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IDonation {
  _id?: mongoose.Types.ObjectId;
  amount: number;
  orderId: string;
  status: "pending" | "paid";
  currency: string;
  userId?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

interface ISchedule {
  _id?: mongoose.Types.ObjectId;
  hospitalName: string;
  startAt: Date;
  endAt: Date;
  googleEventId: string;
  confirmationEmailSent: boolean;
  userId?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IUser {
  _id?: mongoose.Types.ObjectId;
  name: string;
  isUser: boolean;
  isDonor: boolean;
  email: string;
  emailVerified?: boolean;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

interface IDonor {
  _id?: mongoose.Types.ObjectId;
  name: string;
  phoneNumber: string;
  gender: string;
  dateOfBirth: string;
  location: string;
  bloodGroup: string;
  userId?: mongoose.Schema.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
  user: IUser;
}

export { IProfile, IBlood, IDonation, ISchedule, IUser, IDonor };
