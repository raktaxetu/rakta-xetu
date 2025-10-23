"use server";

import connectToDb from "@/db";
import { Blood } from "@/db/models/blood";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type FetchRequestsFilters = {
  isAccepted?: boolean | null;
  isCritical?: boolean | null;
  limit?: number;
  page?: number;
};

export const fetchRequests = async ({
  isAccepted = null,
  isCritical = null,
  limit = 10,
  page = 1,
}: FetchRequestsFilters) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("failed to fetch requests");
    await connectToDb();

    const skip = (page - 1) * limit;

    const query: any = { userId: { $ne: session.user.id } };
    if (typeof isAccepted === "boolean") {
      query.isAccepted = isAccepted;
    }
    if (typeof isCritical === "boolean") {
      query.isCritical = isCritical;
    }

    const totalCount = await Blood.countDocuments(query);

    const result = await Blood.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const requests = JSON.parse(JSON.stringify(result));
    return {
      requests,
      totalCount,
    };
  } catch (error) {
    console.error(error);
    return {
      requests: [],
      totalCount: 0,
      message: "failed to fetch requests",
    };
  }
};
