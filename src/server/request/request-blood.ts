"use server";

import connectToDb from "@/db";
import { Blood } from "@/db/models/blood";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { IBlood } from "../../../types/schema";
import axios from "axios";

export const requestBlood = async (request: IBlood) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("the user is not authenticated");
    await connectToDb();
    const result = await Blood.create({
      ...request,
      userId: session.user.id,
      patientEmail: session.user.email,
    });

    try {
      await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: process.env.ONESIGNAL_APP_ID!,
          exclude_external_user_ids: [session.user.id],
          headings: { en: "New Blood Request!" },
          contents: {
            en: `A new blood request for ${request.bloodGroup} has been submitted at ${request.location}. Please help if you can!`,
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

    return {
      success: true,
      requestId: result._id.toString(),
    };
  } catch (error) {
    console.error(error);
    return {
      message: "failed to request blood",
    };
  }
};
