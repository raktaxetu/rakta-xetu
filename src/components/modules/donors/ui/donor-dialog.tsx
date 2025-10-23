"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IDonor } from "../../../../../types/schema";
import {
  ArrowUpRight,
  CalendarCheck,
  Droplet,
  Loader,
  Mail,
  MapPin,
  MessageSquareShare,
  PhoneCall,
  User,
  VenusAndMars,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useMutation } from "@tanstack/react-query";
import { sendRequest } from "@/server/donors/send-request";
import { toast } from "sonner";
import React from "react";

interface DonorDialogProps {
  donor: IDonor;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange: (open: boolean) => void;
}

export function DonorDialog({
  donor,
  open,
  onOpenChange,
  setOpen,
}: DonorDialogProps) {
  if (!donor) return null;

  const mutation = useMutation({
    mutationKey: ["send-request"],
    mutationFn: async () => {
      const response = await sendRequest(
        donor.user.email,
        donor.user._id?.toString()
      );
      return response;
    },
    onSuccess: () => {
      toast.success("Request has been sent successfully");
      setOpen(false);
    },
    onError: (error) => {
      console.log(error?.message);
      toast.error("Failed to send request");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg text-neutral-600 font-light">
            Donor Information
          </DialogTitle>
          <DialogDescription className="font-light text-neutral-500">
            These are the basic information about the donor
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <User size={16} className="text-rose-500" />
            <div>Full Name: {donor.user.name}</div>
          </div>
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <Mail size={16} className="text-rose-500" />
            <div>Email: {donor.user.email}</div>
          </div>
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <VenusAndMars size={16} className="text-rose-500" />
            <div>
              Gender: {donor.gender[0].toUpperCase() + donor.gender.slice(1)}
            </div>
          </div>
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <CalendarCheck size={16} className="text-rose-500" />
            <div>Date of Birth: {donor.dateOfBirth}</div>
          </div>
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <Droplet size={16} className="text-rose-500" />
            <div>Blood Group: {donor.bloodGroup}</div>
          </div>
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <PhoneCall size={16} className="text-rose-500" />
            <div>Phone Number: {donor.phoneNumber}</div>
          </div>
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <MapPin size={16} className="text-rose-500" />
            <div>Location: {donor.location}</div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" asChild>
            <Link
              href={`/chat/${donor.user._id?.toString()}`}
              className="flex justify-center items-center gap-x-2"
            >
              Chat Now
              <MessageSquareShare />
            </Link>
          </Button>
          <Button
            className="flex justify-center items-center gap-x-2"
            variant="tertiary"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation?.isPending ? "Sending..." : "Send Request"}
            {mutation?.isPending ? (
              <Loader className="animate-spin" />
            ) : (
              <ArrowUpRight />
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
