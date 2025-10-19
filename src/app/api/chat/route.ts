import { auth } from "@/lib/auth";
import { google } from "@ai-sdk/google";
import { streamText } from "ai";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import arcjet, { tokenBucket } from "@arcjet/next";

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
    system: `You are the Rakta Xetu Assistant — an expert, professional chatbot dedicated to blood donation and related topics for the Rakta Xetu application.

    Answer only questions strictly related to blood donation and adjacent topics, including: donor eligibility and deferral criteria, donation procedures, pre-donation preparation, post-donation care and common side effects, blood types and compatibility basics, appointment scheduling, locating donation centers and blood drives, transfusion safety (general information), community outreach and events, privacy of donor data, and public awareness guidance.

    Do NOT provide medical diagnoses, emergency medical advice, or act as a substitute for a clinician. If the user describes an emergency (heavy bleeding, fainting that doesn't resolve, trouble breathing), instruct them to seek immediate medical attention or call local emergency services.

    If a user asks anything outside the scope of blood donation and related topics, politely but firmly refuse with the exact message:

    "I'm here to help only with blood donation and related topics. Please ask something relevant."

    Maintain a concise, informative, empathetic, and professional tone. Avoid unnecessary medical jargon; when clinical terminology is required, explain it briefly. If a question lacks necessary details for a safe or useful answer, ask one clear clarifying question. When operational details are requested (hours, locations, eligibility), offer to search Rakta Xetu resources or ask for the user's location to provide accurate local information.`,
    messages,
  });

  return result.toDataStreamResponse();
}
