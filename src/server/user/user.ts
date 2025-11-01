"use server";

import { auth } from "@/lib/auth";
import { IProfile } from "../../../types/schema";
import { headers } from "next/headers";
import connectToDb from "@/db";
import Profile from "@/db/models/profile";
import { StreamChat } from "stream-chat";
import axios from "axios";
import { upsertVector } from "@/vector/services/donor-vectors";

const serverClient = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export const createUser = async (items: IProfile) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("user is not authenticated");
    }
    await connectToDb();
    const profile = await Profile.findOne({ userId: session.user.id });
    if (profile) throw new Error("profile already exists");
    const result = await Profile.create({ ...items, userId: session.user.id });
    await serverClient.upsertUser({
      id: session.user.id,
      name: session.user.name,
      image:
        session.user.image ||
        `https://getstream.io/random_png/?id=${session.user.id}`,
    });

    await upsertVector(result);

    try {
      await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: process.env.ONESIGNAL_APP_ID!,
          include_external_user_ids: [session.user.id],
          headings: { en: "Successful Profile Creation!" },
          contents: {
            en: "Thank you for registering with Raktaxetu! Your account has been successfully created. We’re glad to welcome you to our community.",
          },
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
      profileId: result._id.toString(),
    };
  } catch (error) {
    console.error(error);
    return {
      message: "failed to create profile",
    };
  }
};
