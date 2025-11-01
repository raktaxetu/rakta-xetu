"use server";
import { auth } from "@/lib/auth";
import { index } from "../pinecone";
import { headers } from "next/headers";
import connectToDb from "@/db";
import Profile from "@/db/models/profile";
import { IProfile } from "../../../types/schema";
import { db } from "@/lib/auth";
import { ObjectId } from "mongodb";

export const searchDonorsWithAI = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("The user is not authenticated");

    await connectToDb();

    const myProfile = (await Profile.findOne({
      userId: session.user.id,
    }).lean()) as IProfile | null;

    if (!myProfile) {
      return { error: "The profile doesn't exist" };
    }

    const aiQuery = `
    Find blood donors whose blood group is EXACTLY ${myProfile.bloodGroup} and who are located in or near ${myProfile.location}.
    Blood group must match exactly: ${myProfile.bloodGroup}.
    Location proximity is the secondary priority: ${myProfile.location}, nearby areas.
    Return the most relevant and closest matches first.
    `.trim();

    const results = await index.searchRecords({
      query: {
        topK: 10,
        inputs: { text: aiQuery },
      },
    });
    const result = results.result.hits;
    const resultIds = result.map((item: any) => item._id);

    const profiles = await Profile.find({ _id: { $in: resultIds } }).lean();

    if (!profiles.length) return [];
    const profilesById = new Map(
      profiles.map((p: any) => [p._id?.toString(), p])
    );

    const orderedProfiles = resultIds
      .map((id: any) => profilesById.get(id?.toString()))
      .filter(Boolean) as any[];

    const filteredProfiles = orderedProfiles.filter(
      (p: any) => p.userId?.toString() !== session.user.id
    );

    if (!filteredProfiles.length) return [];

    const profileCreatorIds = filteredProfiles
      .map((p) => p.userId)
      .filter((id): id is string | ObjectId => !!id)
      .map((id) => new ObjectId(id.toString()));

    const users = await db
      .collection("user")
      .find({
        _id: { $in: profileCreatorIds },
        isDonor: true,
      })
      .toArray();

    const donors = filteredProfiles
      .map((profile: any) => {
        const user = users.find(
          (u: any) => u._id.toString() === profile.userId?.toString()!
        );

        if (!user) return null;

        return {
          _id: profile._id?.toString()!,
          bloodGroup: profile.bloodGroup,
          createdAt: profile.createdAt,
          updatedAt: profile.updatedAt,
          dateOfBirth: profile.dateOfBirth,
          gender: profile.gender,
          location: profile.location,
          name: profile.name,
          phoneNumber: profile.phoneNumber,
          userId: profile.userId,
          user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
            image: user.image,
            isDonor: user.isDonor,
            isUser: user.isUser,
            emailVerified: user.emailVerified,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
          },
        };
      })
      .filter(Boolean);
    return JSON.parse(JSON.stringify(donors));
  } catch (error) {
    console.error(error);
    return {
      message: "Failed to search donors",
      error: error instanceof Error ? error.message : error,
    };
  }
};
