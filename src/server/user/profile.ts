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
    const [donationStats, requestStats] = await Promise.all([
      Blood.aggregate([
        {
          $match: {
            isAccepted: true,
            acceptedBy: session.user.id,
          },
        },
        {
          $group: {
            _id: null,
            totalUnits: { $sum: { $ifNull: ["$units", 0] } },
            count: { $sum: 1 },
          },
        },
      ]),
      Blood.aggregate([
        {
          $match: {
            userId: session.user.id,
          },
        },
        {
          $group: {
            _id: null,
            totalUnits: { $sum: { $ifNull: ["$units", 0] } },
            count: { $sum: 1 },
          },
        },
      ]),
    ]);
    const totalDonations = donationStats[0]?.totalUnits || 0;
    const totalRequests = requestStats[0]?.totalUnits || 0;
    const totalLivesAffected =
      (donationStats[0]?.count || 0) + (requestStats[0]?.count || 0);
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

