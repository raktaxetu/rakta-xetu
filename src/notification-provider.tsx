"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";
import { authClient } from "./lib/auth-client";

export function NotificationProvider({ children }: Children) {
  const { data: session } = authClient.useSession();
  useEffect(() => {
    if (typeof window !== "undefined") {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
        notifyButton: {
          enable: true,
        } as any,
        allowLocalhostAsSecureOrigin: true,
      }).then(() => {
        OneSignal.Notifications.requestPermission();
      });
    }
  }, []);

  useEffect(() => {
    if (session?.user.id) {
      OneSignal.login(session.user.id);
      OneSignal.User.addTag("user_id", session.user.id);
    }
  }, [session?.user.id]);
  return <>{children}</>;
}
