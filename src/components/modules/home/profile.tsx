import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { auth } from "@/lib/auth";
import { getProfileInfo } from "@/server/user/profile";
import initials from "initials";
import { AlertTriangle } from "lucide-react";
import { headers } from "next/headers";
import Link from "next/link";
import { ChartComponent } from "../stats/chart";
import { DonationStatus } from "../profile/donation-status";

export async function ProfileInfo() {
  let profileInfo = null;
  const session = await auth.api.getSession({ headers: await headers() });
  if(session) {
    profileInfo = await getProfileInfo();
  }
  
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 place-items-center gap-4 mb-4 h-full">
      <div className="p-4 rounded-lg border shadow-xs w-full h-full">
        <div className="flex flex-col gap-y-2 items-center justify-between">
          <Avatar className="h-[45px] w-[45px]">
            <AvatarImage src={session?.user.image || ""} />
            <AvatarFallback className="bg-rose-500 text-white">
              {initials(session?.user.name || "")}
            </AvatarFallback>
          </Avatar>
          <p className="text-xl text-neutral-600 font-light">
            {session?.user.name}
          </p>
          <p className="text-sm text-neutral-500 font-light">
            {session?.user.email}
          </p>
          <p className="text-neutral-500 font-light">
            Blood Group:{" "}
            <span className="text-rose-500">{profileInfo?.bloodGroup}</span>
          </p>
          <Button variant="tertiary" asChild className="mt-2" size="sm">
            <Link
              href="/complaint"
              className="flex justify-center items-center gap-x-2 text-neutral-500"
            >
              <span className="font-light">Make a Complaint</span>
              <AlertTriangle />
            </Link>
          </Button>
          <DonationStatus />
        </div>
      </div>
      <div className="p-4 rounded-lg border shadow-xs w-full h-full">
        <div className="flex flex-col justify-center items-center">
          <ChartComponent />
        </div>
      </div>
    </div>
  );
}
