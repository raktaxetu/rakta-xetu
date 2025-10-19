"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/auth";
import connectToDb from "@/db";
import { ObjectId } from "mongodb";

export const fetchDonors = async () => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("the user is not authenticated");
    await connectToDb();
    const donors = await db
      .collection("profiles")
      .aggregate([
        {
          $lookup: {
            from: "user",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: {
            path: "$user",
            preserveNullAndEmptyArrays: false,
          },
        },
        {
          $match: {
            "user.isDonor": true,
            "user._id": { $ne: new ObjectId(session.user.id) },
          },
        },
        {
          $sort: { "user.createdAt": -1 },
        },
        {
          $project: {
            __v: 0,
            "user.password": 0,
            "user.__v": 0,
          },
        },
      ])
      .toArray();
    return JSON.parse(JSON.stringify(donors));
  } catch (error) {
    console.error(error);
    return { message: "failed to fetch donors" };
  }
};
