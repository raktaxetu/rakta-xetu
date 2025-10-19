import { ConfirmationEmail } from "@/components/emails/confirmation-email";
import { inngest } from "../client";
import { Resend } from "resend";
import connectToDb from "@/db";
import Schedule from "@/db/models/schedule";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendConfirmationEmail = inngest.createFunction(
  { id: "confirmation" },
  { event: "confirmation/email" },
  async ({ event }) => {
    const donationDateUTC = event.data.startTime;
    const timeZone = "Asia/Kolkata";
    const donationDateIST = toZonedTime(donationDateUTC, timeZone);
    const formattedDate = format(donationDateIST, "d MMMM yyyy, h:mm a");

    const emailProps = {
      donorName: event.data.name ?? event.data.userId ?? undefined,
      hospitalName: event.data.hospitalName ?? "",
      donationDateTime: formattedDate,
      calendarLink:
        event.data.calendarLink ?? event.data.googleCalendarLink ?? undefined,
    };

    const { data } = await resend.emails.send({
      from: `RaktaXetu <${process.env.SMTP_DOMAIN!}>`,
      to: [event.data.email],
      subject: "Blood Donation Confirmation & Health Tips",
      react: ConfirmationEmail(emailProps as any),
    });

    if (data?.id) {
      await connectToDb();
      await Schedule.findOneAndUpdate(
        { userId: event.data.userId, googleEventId: event.data.googleEventId },
        { $set: { confirmationEmailSent: true } },
        { new: true }
      );
    }

    return { data, time: event.data.startTime };
  }
);
