"use server";

import connectToDb from "@/db";
import { Blood } from "@/db/models/blood";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type MyRequestsFilters = {
  isAccepted?: boolean | null;
  isCritical?: boolean | null;
  limit?: number;
  page?: number;
};

export const myRequests = async ({
  isAccepted = null,
  isCritical = null,
  limit = 10,
  page = 1,
}: MyRequestsFilters) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("the user is not authenticated");
    await connectToDb();

    const skip = (page - 1) * limit;
    
    const query: any = { userId: session.user.id };
    if (typeof isAccepted === "boolean") {
      query.isAccepted = isAccepted;
    }
    if (typeof isCritical === "boolean") {
      query.isCritical = isCritical;
    }

    const totalCount = await Blood.countDocuments(query);
    const results = await Blood.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const myRequests = JSON.parse(JSON.stringify(results));
    return {
      requests: myRequests,
      totalCount: totalCount,
    };
  } catch (error) {
    console.error(error);
    return {
      requests: [],
      totalCount: 0,
      message: "failed to fetch the requests",
    };
  }
};
