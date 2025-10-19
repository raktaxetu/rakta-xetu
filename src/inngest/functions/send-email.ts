import ThankYouEmail from "@/components/emails/donation-email";
import { inngest } from "../client";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendEmail = inngest.createFunction(
  { id: "email" },
  { event: "donation/email" },
  async ({ event }) => {
    const { data } = await resend.emails.send({
      from: `RaktaXetu <${process.env.SMTP_DOMAIN!}>`,
      to: [event.data.email],
      subject: "Donation",
      react: ThankYouEmail({
        amount: event.data.amount,
        orderId: event.data.orderId,
      }),
    });
    return data;
  }
);
