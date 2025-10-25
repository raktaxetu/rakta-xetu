"use server";
import { auth } from "@/lib/auth";
import { index } from "../pinecone";
import { headers } from "next/headers";
import connectToDb from "@/db";
import Profile from "@/db/models/profile";
import { IProfile } from "../../../types/schema";

export const searchDonorsWithAI = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("the user is not authenticated");
    await connectToDb();
    const myProfile: IProfile | null = await Profile.findOne({ userId: session.user.id });
    if (!myProfile) {
      return {
        error: "the profile doesn't exist",
      };
    }
    const aiQuery = `Find donors with blood group ${myProfile.bloodGroup} in ${myProfile.location}`;
    const results = await index.searchRecords({
      query: {
        topK: 10,
        inputs: { text: aiQuery },
      },
    });
    const donors = results.result.hits;
    console.log(donors);
    return donors;
  } catch (error) {
    console.error(error);
    return {
      message: "failed to search donors",
    };
  }
};
