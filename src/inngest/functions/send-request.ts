import { inngest } from "../client";
import { SendRequest } from "@/components/emails/send-request";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const sendRequest = inngest.createFunction(
  { id: "send-request" },
  { event: "send/request" },
  async ({ event }) => {
    const { data } = await resend.emails.send({
      from: `RaktaXetu <${process.env.SMTP_DOMAIN!}>`,
      to: [event.data.donor],
      subject: "Donation Request",
      react: SendRequest({
        requestor: event.data.requestor,
        email: event.data.email,
        image: event.data.image,
      }),
    });
    return data;
  }
);
