"use server";

import connectToDb from "@/db";
import Profile from "@/db/models/profile";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { inngest } from "@/inngest/client";

export const sendRequest = async (donorEmail: string) => {
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
  } catch (error) {
    console.error(error);
    return {
      message: "failed to send request",
    };
  }
};
