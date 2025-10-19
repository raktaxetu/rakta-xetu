"use client";
import { authClient } from "@/lib/auth-client";
import { Button } from "../ui/button";
import Image from "next/image";

export function LoginButton() {
  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
      newUserCallbackURL: "/onboarding",
    });
  };

  return (
    <Button
      variant="outline"
      className="flex justify-center items-center gap-x-3 w-[200px]"
      onClick={signIn}
    >
      <Image src="/google.svg" height={18} width={18} alt="google" />
      <span className="text-neutral-500 font-normal">Login With Google</span>
    </Button>
  );
}
