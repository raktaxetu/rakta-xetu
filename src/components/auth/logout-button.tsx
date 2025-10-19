"use client";

import { LogOut } from "lucide-react";
import { Button } from "../ui/button";
import { useMutation } from "@tanstack/react-query";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function LogoutButton() {
  const router = useRouter();
  const mutation = useMutation({
    mutationKey: ["auth"],
    mutationFn: async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/auth");
          },
        },
      });
    },
    onError: (error) => {
      console.error(error);
      toast.error("Failed to Logout");
    },
  });
  return (
    <Button
      variant="destructive"
      className="flex justify-center items-center gap-x-2"
      disabled={mutation.isPending}
      onClick={() => mutation.mutate()}
    >
      <span>Logout</span>
      <LogOut />
    </Button>
  );
}
