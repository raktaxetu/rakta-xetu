import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://fd2cfac8ecbbc08d726a61187f815429@o4510221911064576.ingest.de.sentry.io/4510221943701584",
  integrations: [
    Sentry.vercelAIIntegration({
      recordInputs: true,
      recordOutputs: true,
    }),
    Sentry.consoleLoggingIntegration({ levels: ["log", "warn", "error"] }),
  ],
  tracesSampleRate: 1,
  enableLogs: true,
  sendDefaultPii: true,
});
