"use server";
import { inngest } from "@/inngest/client";

export const sendEmail = async (
  email: string,
  amount: number,
  orderId: string
) => {
  try {
    await inngest.send({
      name: "donation/email",
      data: {
        email,
        amount,
        orderId,
      },
    });
  } catch (error) {
    console.error(error);
    return {
      message: "failed to send event",
    };
  }
};
