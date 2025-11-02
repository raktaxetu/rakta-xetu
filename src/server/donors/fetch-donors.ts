"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/lib/auth";
import connectToDb from "@/db";
import { ObjectId } from "mongodb";

interface FetchDonorsParams {
  search?: string;
  page?: number;
  limit?: number;
}

interface FetchDonorsResult {
  donors: any[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  hasMore: boolean;
}

export const fetchDonors = async (
  params: FetchDonorsParams = {}
): Promise<FetchDonorsResult> => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("the user is not authenticated");

    await connectToDb();

    const { search = "", page = 1, limit = 10 } = params;
    const skip = (page - 1) * limit;

    const searchConditions = search.trim()
      ? {
          $or: [
            { "user.name": { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const baseMatch = {
      "user.isDonor": true,
      "user._id": { $ne: new ObjectId(session.user.id) },
      ...searchConditions,
    };

    const results = await db
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
          $match: baseMatch,
        },
        {
          $sort: { "user.createdAt": -1 },
        },
        {
          $facet: {
            metadata: [{ $count: "total" }],
            data: [
              { $skip: skip },
              { $limit: limit },
              {
                $project: {
                  __v: 0,
                  "user.password": 0,
                  "user.__v": 0,
                },
              },
            ],
          },
        },
      ])
      .toArray();

    const total = results[0]?.metadata[0]?.total || 0;
    const donors = results[0]?.data || [];
    const totalPages = Math.ceil(total / limit);

    return {
      donors: JSON.parse(JSON.stringify(donors)),
      totalCount: total,
      totalPages,
      currentPage: page,
      hasMore: page < totalPages,
    };
  } catch (error) {
    console.error("Error fetching donors:", error);
    return {
      donors: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: 1,
      hasMore: false,
    };
  }
};
