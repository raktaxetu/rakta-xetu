"use server";
import connectToDb from "@/db";
import { Blood } from "@/db/models/blood";
import Profile from "@/db/models/profile";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const getProfileInfo = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("the user is not authenticated");
    }
    await connectToDb();
    const profile = await Profile.findOne({ userId: session?.user.id });
    return {
      name: profile.name,
      email: session.user.email,
      bloodGroup: profile.bloodGroup,
      isDonor: session.user.isDonor,
    };
  } catch (error) {
    console.error(error);
    return {
      message: "failed to get name",
    };
  }
};

export const chartInfo = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session) {
      throw new Error("the user is not authenticated");
    }
    await connectToDb();
    const donation = await Blood.find({
      isAccepted: true,
      acceptedBy: session.user.id,
    });
    const request = await Blood.find({ userId: session.user.id });
    const totalDonations = donation.reduce(
      (acc, curr) => acc + (curr.units || 0),
      0
    );
    const totalRequests = request.reduce(
      (acc, curr) => acc + (curr.units || 0),
      0
    );
    const totalLivesAffected = donation.length + request.length;
    return {
      totalDonations,
      totalRequests,
      totalLivesAffected,
      success: true,
    };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      message: "failed to get chart info",
      error,
    };
  }
};
