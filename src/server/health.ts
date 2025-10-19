"use server";
import { inngest } from "@/inngest/client";

export const health = async () => {
  try {
    await inngest.send({
      name: "test/health",
    });
  } catch (error) {
    console.error(error);
    return {
      message: "failed to send event",
    };
  }
};
