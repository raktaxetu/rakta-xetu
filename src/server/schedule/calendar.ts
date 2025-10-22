"use server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { checkScope } from "./scope";
import { google } from "googleapis";
import connectToDb from "@/db";
import Schedule from "@/db/models/schedule";
import { sendEmail } from "./email";
import axios from "axios";

export const saveEvent = async (hospitalName: string, donationTime: any) => {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session) throw new Error("the user is not authenticated");

    const accessToken = await auth.api.getAccessToken({
      body: { providerId: "google", userId: session.user.id },
    });
    if (!accessToken) throw new Error("access token is not present");
    const hasScope = await checkScope(accessToken);
    if (!hasScope) {
      return {
        hasScope: false,
      };
    }

    const startTime = new Date(donationTime).toISOString();
    const endTime = new Date(
      new Date(donationTime).getTime() + 60 * 60 * 1000
    ).toISOString();
    const event = {
      summary: `Blood donation at ${hospitalName}`,
      description: `Scheduled blood donation at ${hospitalName}`,
      start: { dateTime: startTime, timeZone: "Asia/Kolkata" },
      end: { dateTime: endTime, timeZone: "Asia/Kolkata" },
    };

    const oauth = new google.auth.OAuth2();
    oauth.setCredentials({ access_token: accessToken.accessToken });
    const calendar = google.calendar({ version: "v3", auth: oauth });
    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });
    const calendarLink = response.data.htmlLink;
    await connectToDb();
    const schedule = await Schedule.create({
      hospitalName,
      startAt: startTime,
      endAt: endTime,
      googleEventId: response.data.id,
      userId: session.user.id,
    });

    await sendEmail(
      hospitalName,
      schedule.startAt,
      calendarLink,
      session.user.name,
      session.user.email,
      session.user.id,
      schedule.googleEventId
    );
    try {
      await axios.post(
        "https://onesignal.com/api/v1/notifications",
        {
          app_id: process.env.ONESIGNAL_APP_ID!,
          include_external_user_ids: [session.user.id],
          headings: { en: "New Appointment Schedule" },
          contents: {
            en: "Your blood donation has been successfully scheduled! Please check your inbox for a confirmation email.",
          },
        },
        {
          headers: {
            Authorization: `Basic ${process.env.ONESIGNAL_REST_API_KEY!}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
      console.error(error);
    }
    return {
      scheduleId: schedule._id.toString(),
      eventId: schedule.googleEventId,
      success: true,
      message: "workflow triggered",
    };
  } catch (error) {
    console.error(error);
    return {
      message: "failed to save the event to google calendar",
    };
  }
};
