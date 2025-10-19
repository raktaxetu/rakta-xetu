import { inngest } from "../client";
import { AcceptRequest } from "@/components/emails/accept-request";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const acceptRequest = inngest.createFunction(
  { id: "accept-request" },
  { event: "accept/request" },
  async ({ event }) => {
    const { data } = await resend.emails.send({
      from: `RaktaXetu <${process.env.SMTP_DOMAIN!}>`,
      to: [event.data.requestorEmail],
      subject: "Someone's ready to help — your blood request is accepted",
      react: AcceptRequest({
        donor: event.data.donor,
        email: event.data.donorEmail,
        image: event.data.donorImage,
      }),
    });
    return data;
  }
);
