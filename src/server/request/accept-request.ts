"use server";
import connectToDb from "@/db";
import { Blood } from "@/db/models/blood";
import Profile from "@/db/models/profile";
import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const acceptRequest = async (
  requestorEmail: string,
  requestId: string
) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) {
      return { success: false, message: "User is not authenticated" };
    }
    await connectToDb();
    const profile = await Profile.findOne({ userId: session.user.id });
    if (!profile) {
      return { success: false, message: "User profile not found" };
    }

    const { email, image } = session.user;
    const updatedRequest = await Blood.findOneAndUpdate(
      {
        _id: requestId,
        isAccepted: false,
      },
      {
        $set: { isAccepted: true, acceptedBy: session.user.id },
      },
      { new: true }
    );
    if (!updatedRequest) {
      return {
        success: false,
        message: "Someone else has already accepted this blood request",
      };
    }
    await inngest.send({
      name: "accept/request",
      data: {
        donor: profile.toObject(),
        donorEmail: email,
        donorImage: image,
        requestorEmail,
      },
    });
    return { success: true, message: "Blood request accepted successfully" };
  } catch (error) {
    console.error("Error accepting request:", error);
    return {
      success: false,
      message: "Failed to accept request",
    };
  }
};
