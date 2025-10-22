import { NextResponse, NextRequest } from "next/server";
import { StreamChat } from "stream-chat";
import axios from "axios";

const client = StreamChat.getInstance(
  process.env.STREAM_API_KEY!,
  process.env.STREAM_API_SECRET!
);

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const rawBody = await request.text();
    const signature = request.headers.get("x-signature");
    if (signature) {
      const valid = client.verifyWebhook(rawBody, signature);
      if (!valid) {
        return NextResponse.json(
          { error: "Invalid webhook signature" },
          { status: 401 }
        );
      }
    }

    const body = JSON.parse(rawBody);
    if (body?.type === "message.new") {
      const { message, user, members } = body;
      const receivers =
        members?.filter((member: any) => member.user_id !== user.id) || [];
      const receiverIds = receivers.map((member: any) => member.user_id);
      if (receiverIds.length > 0) {
        await axios.post(
          "https://onesignal.com/api/v1/notifications",
          {
            app_id: process.env.ONESIGNAL_APP_ID!,
            include_external_user_ids: receiverIds,
            headings: { en: `${user.name || "New Message"}` },
            contents: { en: message.text || "You received a new message!" },
            url: `${process.env.BETTER_AUTH_URL!}/chat/${user.id}`,
          },
          {
            headers: {
              Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY!}`,
              "Content-Type": "application/json",
            },
          }
        );
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
