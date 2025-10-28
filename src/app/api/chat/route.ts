import { auth } from "@/lib/auth";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import arcjet, { tokenBucket } from "@arcjet/next";
import { webSearch } from "@/tools/web-search";
import { prompt } from "@/tools/assistant";

export const maxDuration = 30;

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    tokenBucket({
      mode: "LIVE",
      characteristics: ["userId"],
      refillRate: 5,
      interval: 10,
      capacity: 10,
    }),
  ],
});

export async function POST(req: Request) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    return NextResponse.json(
      { error: "the user is not authenticated" },
      { status: 401 }
    );
  }
  const userId = session.user.id;
  const decision = await aj.protect(req, { userId, requested: 5 });
  if (decision.isDenied()) {
    return NextResponse.json(
      { error: "Too Many Requests", reason: decision.reason },
      { status: 429 }
    );
  }

  const { messages } = await req.json();
  const result = streamText({
    model: google("gemini-2.5-flash"),
    system: prompt,
    messages,
    tools: {
      webSearch,
    },
    maxSteps: 5,
    experimental_telemetry: {
      isEnabled: true,
      recordInputs: true,
      recordOutputs: true,
    },
  });
  return result.toDataStreamResponse();
}
