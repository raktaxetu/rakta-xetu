import { inngest } from "../client";

export const healthCheck = inngest.createFunction(
  { id: "health" },
  { event: "test/health" },
  async ({ step }) => {
    await step.sleep("wait-a-moment", "1s");
    return { message: "inngest is working" };
  }
);
