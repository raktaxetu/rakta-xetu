import { LoginButton } from "@/components/auth/login-button";
import { Button } from "@/components/ui/button";
import { socialLinks } from "@/lib/constants";
import { HeartPulse } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AuthPage() {
  return (
    <div className="min-h-svh w-full flex justify-center items-center overflow-x-hidden p-4">
      <div className="max-w-sm mx-auto w-full flex flex-col gap-y-3 justify-center items-center">
        <Button variant="secondary" className="pointer-events-none">
          <HeartPulse />
        </Button>
        <h1 className="text-2xl text-neutral-600 font-light">RaktaXetu</h1>
        <p className="text-neutral-400 font-light text-center">
          Login to RaktaXetu to join the life-saving community
        </p>
        <LoginButton />
      </div>
      <div className="fixed bottom-0 p-6 w-full text-center">
        <div className="text-neutral-400 font-extralight text-sm">
          By signing up, you agree to our <br />{" "}
          <Link href="/terms" className="underline">
            Terms & Conditions
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline">
            Privacy Policy
          </Link>
        </div>
        <div className="my-4">
          <p className="text-neutral-400 font-extralight text-sm text-center">
            Find Us On
          </p>
          <div className="flex gap-x-4 my-2 justify-center items-center">
            {socialLinks.map((item) => (
              <a href={item.path} target="_blank" key={item.path}>
                <button className="cursor-pointer">
                  <Image
                    src={item.imageUrl}
                    height={24}
                    width={24}
                    alt={item.label}
                  />
                </button>
              </a>
            ))}
          </div>
          <div className="my-2 flex justify-center items-center text-neutral-400 font-extralight text-sm">
            <p className="text-center">
              Contact us at{" "}
              <a href="mailto:raktaxetu@gmail.com" className="underline">
                raktaxetu@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
