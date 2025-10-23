"use server";

import connectToDb from "@/db";
import Profile from "@/db/models/profile";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { inngest } from "@/inngest/client";
import axios from "axios";

export const sendRequest = async (donorEmail: string, donorId: string | undefined | null) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("the user is not authenticated");
    await connectToDb();
    const requestor = await Profile.findOne({ userId: session.user.id });
    const { email, image } = session.user;
    await inngest.send({
      name: "send/request",
      data: {
        requestor,
        email,
        donor: donorEmail,
        image,
      },
    });
    try {
      await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: process.env.ONESIGNAL_APP_ID!,
          include_external_user_ids: [donorId],
          headings: { en: "Someone Requested Your Blood" },
          contents: {
            en: "You have a new blood request. Please check your inbox for more details.",
          },
          url: `${process.env.BETTER_AUTH_URL!}/request-blood`,
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
  } catch (error) {
    console.error(error);
    return {
      message: "failed to send request",
    };
  }
};
