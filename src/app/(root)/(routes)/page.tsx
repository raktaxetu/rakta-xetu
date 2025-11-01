import { ScheduleDonation } from "@/components/modules/schedule/schedule-donation";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Features } from "../../../components/modules/home/features";
import { ProfileInfo } from "@/components/modules/home/profile";

export default async function Home() {
  const session = await auth.api.getSession({ headers: await headers() });
  return (
    <div className="w-full">
      <h1 className="text-neutral-500 font-light text-xl">
        Welcome {session?.user.name}
      </h1>
      <p className="font-light text-neutral-400 my-2">How are you today?</p>
      <ScheduleDonation />
      <Features />
      <ProfileInfo />
      <p className="text-sm text-neutral-500 font-light text-center pt-2 pb-4">
        © 2025 RaktaXetu — Connecting lives through blood donation.
      </p>
    </div>
  );
}
