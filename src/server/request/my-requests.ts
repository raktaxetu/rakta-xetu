"use server";

import connectToDb from "@/db";
import { Blood } from "@/db/models/blood";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type MyRequestsFilters = {
  isAccepted?: boolean;
  isCritical?: boolean;
};

export const myRequests = async (filters?: MyRequestsFilters) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("the user is not authenticated");
    await connectToDb();
    const query: any = { userId: session.user.id };
    if (typeof filters?.isAccepted === "boolean") {
      query.isAccepted = filters?.isAccepted;
    }
    if (typeof filters?.isCritical === "boolean") {
      query.isCritical = filters?.isCritical;
    }
    const results = await Blood.find(query).sort({ createdAt: -1 });
    const myRequests = JSON.parse(JSON.stringify(results));
    return myRequests;
  } catch (error) {
    console.error(error);
    return {
      message: "failed to fetch the requests",
    };
  }
};
