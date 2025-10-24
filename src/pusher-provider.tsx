"use client";

import { useEffect } from "react";
import pusherClient from "./pusher-client";
import { toast } from "sonner";
import { authClient } from "./lib/auth-client";
import { useQueryClient } from "@tanstack/react-query";

type Request = {
  message: string;
  userId: string;
};

export function PusherProvider({ children }: Children) {
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  useEffect(() => {
    if (!session?.user?.id) return;
    const channel = pusherClient.subscribe("blood-requests");

    channel.bind("new-request", (data: Request) => {
      if (session?.user.id !== data.userId) {
        toast.success(data.message);
      }
      queryClient.refetchQueries({
        queryKey: ["requests"],
      });
    });

    channel.bind("delete-request", () => {
      queryClient.refetchQueries({
        queryKey: ["requests"],
      });
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, [session?.user.id, queryClient]);
  return <>{children}</>;
}
