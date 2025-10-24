"use server";

import connectToDb from "@/db";
import { Blood } from "@/db/models/blood";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import pusher from "@/pusher";

export const cancelRequest = async (requestId: string) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("the user is not authenticated");
    await connectToDb();
    const deleted = await Blood.findOneAndDelete({
      _id: requestId,
      userId: session.user.id,
    });
    if (!deleted) throw new Error("request not found or not authorized");
    await pusher.trigger("blood-requests", "delete-request", {});
    return { success: true };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: (error as any)?.message || "failed to cancel request",
    };
  }
};
