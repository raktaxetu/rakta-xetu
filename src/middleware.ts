import arcjet, { createMiddleware, detectBot } from "@arcjet/next";

export const runtime = "nodejs";

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
        "CATEGORY:MONITOR",
        "CATEGORY:PREVIEW",
        "GO_HTTP",
      ],
    }),
  ],
});

export default createMiddleware(aj);
