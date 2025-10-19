import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { redirect } from "next/navigation";

const client = new MongoClient(process.env.DATABASE_URL!);
export const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  socialProviders: {
    google: {
      prompt: "select_account consent",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      accessType: "offline",
      scope: [
        "openid",
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/calendar",
      ],
    },
  },
  user: {
    additionalFields: {
      isUser: {
        type: "boolean",
        required: true,
        defaultValue: false,
      },
      isDonor: {
        type: "string",
        required: true,
        defaultValue: true,
      },
    },
    deleteUser: {
      enabled: true,
      afterDelete: () => {
        redirect("/auth");
      },
    },
  },
  plugins: [nextCookies()],
});
