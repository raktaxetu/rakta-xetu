import { NextRequest, NextResponse } from "next/server";
import arcjet, { tokenBucket } from "@arcjet/next";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["ip.src"],
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export async function GET(request: NextRequest) {
  try {
    const decision = await aj.protect(request, { requested: 2 });
    if (decision.isDenied()) {
      return NextResponse.json(
        { error: "Too Many Requests", reason: decision.reason },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { success: true, message: "api is working" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "healthcheck route is not working" },
      { status: 500 }
    );
  }
}
