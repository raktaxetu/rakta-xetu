import { tool } from "ai";
import { z } from "zod";
import Exa from "exa-js";

export const exa = new Exa(process.env.EXA_API_KEY!);

export const webSearch = tool({
  description:
    "Fetch up-to-date public information about blood banks, donation centers, blood drives, and other blood-donation-related topics. Use this to locate donation sites or confirm availability in a region.",
  parameters: z.object({
    query: z
      .string()
      .min(1)
      .max(100)
      .describe(
        "The search query, such as 'active blood banks in xyz location' or 'nearest blood donation camp in xyz location'."
      ),
  }),
  execute: async ({ query }) => {
    const { results } = await exa.searchAndContents(query, {
      livecrawl: "always",
      numResults: 3,
    });
    return results.map((result) => ({
      title: result.title,
      url: result.url,
      content: result.text.slice(0, 1000),
      publishedDate: result.publishedDate,
    }));
  },
});
