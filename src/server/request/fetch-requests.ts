"use server";

import connectToDb from "@/db";
import { Blood } from "@/db/models/blood";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type FetchRequestsFilters = {
  isAccepted?: boolean;
  isCritical?: boolean;
};

export const fetchRequests = async (filters?: FetchRequestsFilters) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("failed to fetch requests");
    await connectToDb();
    const query: any = { userId: { $ne: session.user.id } };
    if (typeof filters?.isAccepted === "boolean") {
      query.isAccepted = filters?.isAccepted;
    }
    if (typeof filters?.isCritical === "boolean") {
      query.isCritical = filters?.isCritical;
    }
    const result = await Blood.find(query).sort({ createdAt: -1 });
    const requests = JSON.parse(JSON.stringify(result));
    return requests;
  } catch (error) {
    console.error(error);
    return {
      message: "failed to fetch requests",
    };
  }
};
