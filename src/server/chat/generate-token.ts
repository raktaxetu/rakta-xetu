"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { StreamChat } from "stream-chat";

const apiKey = process.env.STREAM_API_KEY!;
const apiSecret = process.env.STREAM_API_SECRET!;
const serverClient = StreamChat.getInstance(apiKey, apiSecret);

export const getToken = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("the user is not authenticated");
    const token = serverClient.createToken(session.user.id);
    return {
      token,
      user: {
        id: session.user.id,
        name: session.user.name,
        image:
          session.user.image ??
          `https://getstream.io/random_png/?id=${session.user.id}`,
      },
    };
  } catch (error) {
    console.error(error);
    return {
      message: "failed to generate token",
    };
  }
};
