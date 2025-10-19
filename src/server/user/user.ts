"use server";

import { auth, db } from "@/lib/auth";
import { IProfile } from "../../../types/schema";
import { headers } from "next/headers";
import connectToDb from "@/db";
import Profile from "@/db/models/profile";
import { ObjectId } from "mongodb";
import { StreamChat } from "stream-chat";

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

export const listUsers = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("user is not authenticated");
    await connectToDb();
    const result = await db
      .collection("user")
      .find({ _id: { $ne: new ObjectId(session.user.id) }, isUser: true })
      .sort({ createdAt: -1 })
      .toArray();
    const users = JSON.parse(JSON.stringify(result));
    return users;
  } catch (error) {
    console.error(error);
    return {
      message: "failed to list users",
    };
  }
};
