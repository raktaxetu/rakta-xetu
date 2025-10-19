"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import initials from "initials";
import { IDonor } from "../../../../../types/schema";

interface DonorCardProps {
  donor: IDonor;
  onClick: () => void;
}

export function DonorCard({ donor, onClick }: DonorCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-3 rounded-lg border hover:bg-sidebar transition-all w-full cursor-pointer"
    >
      <div className="w-full flex items-center justify-between">
        <div className="flex justify-center items-center gap-x-4">
          <Avatar>
            <AvatarImage src={donor.user.image} />
            <AvatarFallback>{initials(donor.user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start justify-between">
            <p className="text-sm text-neutral-500 font-light">
              {donor.user.name}
            </p>
            <p className="text-xs text-neutral-400 font-extralight max-w-[160px] truncate">
              {donor.location}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end justify-between">
          <p className="text-sm text-rose-500 font-light">{donor.bloodGroup}</p>
          <p className="text-xs text-neutral-500 font-extralight">
            {donor.gender[0].toUpperCase() + donor.gender.slice(1)}
          </p>
        </div>
      </div>
    </div>
  );
}
