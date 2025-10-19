"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { IBlood } from "../../../../../types/schema";
import { Check } from "lucide-react";

interface RequestCardProps {
  request: IBlood;
  onClick: () => void;
}

export function RequestCard({ request, onClick }: RequestCardProps) {
  return (
    <div
      onClick={onClick}
      className="p-3 border rounded-lg bg-sidebar flex justify-between items-center w-full cursor-pointer"
    >
      <div className="flex flex-col items-start justify-center gap-0.5">
        <p className="text-neutral-600 text-sm font-light flex justify-center items-center gap-x-2">
          {request.age} year old {request.gender}{" "}
          {request.isAccepted && <Check className="text-lime-500" size={14} />}
        </p>
        <p className="text-neutral-600 text-sm font-light">
          {request.units} Unit Blood
        </p>
        <p className="text-xs text-neutral-500 font-light max-w-[160px] truncate">
          {request.location}
        </p>
      </div>
      <div className="flex flex-col justify-between items-end gap-y-4">
        <p className="text-rose-500 font-light text-sm">{request.bloodGroup}</p>
        <div
          className={cn(
            "p-1 rounded text-xs font-light",
            request.isCritical
              ? "text-rose-500 bg-rose-100/80"
              : "text-amber-400 bg-amber-100/80"
          )}
        >
          {request.isCritical ? "Critical" : "Not Critical"}
        </div>
      </div>
    </div>
  );
}
