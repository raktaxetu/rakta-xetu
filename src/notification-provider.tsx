"use client";

import { useEffect } from "react";
import OneSignal from "react-onesignal";

export function NotificationProvider({ children }: Children) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      OneSignal.init({
        appId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID!,
        notifyButton: {
          enable: true,
        } as any,
      });
    }
  }, []);
  return <>{children}</>;
}
