"use server";

import connectToDb from "@/db";
import { Blood } from "@/db/models/blood";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { IBlood } from "../../../types/schema";

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
