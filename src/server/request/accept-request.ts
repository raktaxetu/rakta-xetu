"use server";
import connectToDb from "@/db";
import { Blood } from "@/db/models/blood";
import Profile from "@/db/models/profile";
import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import axios from "axios";

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
    try {
      await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: process.env.ONESIGNAL_APP_ID!,
          include_external_user_ids: [updatedRequest.userId],
          headings: { en: "Someone Accepted Your Blood Request" },
          contents: {
            en: "Your blood request has been accepted. Please check your inbox for details.",
          },
          url: `${process.env.BETTER_AUTH_URL!}/request-blood/my-requests`,
        },
        {
          headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY!}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
    return { success: true, message: "Blood request accepted successfully" };
  } catch (error) {
    console.error("Error accepting request:", error);
    return {
      success: false,
      message: "Failed to accept request",
    };
  }
};
