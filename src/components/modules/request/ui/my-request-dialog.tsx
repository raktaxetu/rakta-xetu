"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { IBlood } from "../../../../../types/schema";
import {
  CalendarCheck,
  Droplet,
  Loader,
  MapPin,
  PhoneCall,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelRequest } from "@/server/request/cancel-request";
import { toast } from "sonner";

interface MyRequestDialogProps {
  request: IBlood;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenChange: (open: boolean) => void;
}

export function MyRequestDialog({
  request,
  open,
  onOpenChange,
  setOpen,
}: MyRequestDialogProps) {
  if (!request) return null;
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ["cancel-request"],
    mutationFn: async () => {
      const res = await cancelRequest(request._id?.toString() || "");
      return res;
    },
    onSuccess: () => {
      toast.success("Request cancelled");
      setOpen(false);
      queryClient.invalidateQueries({
        queryKey: ["myRequests"],
      });
    },
    onError: (err: any) => {
      console.error(err?.message);
      toast.error("Failed to cancel request");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg text-neutral-600 font-light">
            My Request
          </DialogTitle>
          <DialogDescription className="font-light text-neutral-500">
            Details about your blood request
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <User size={16} className="text-rose-500" />
            <div>Patient Name: {request.patientName}</div>
          </div>
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <PhoneCall size={16} className="text-rose-500" />
            <div>Contact: {request.phoneNumber}</div>
          </div>
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <CalendarCheck size={16} className="text-rose-500" />
            <div>Age: {request.age}</div>
          </div>
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <Droplet size={16} className="text-rose-500" />
            <div>Blood Group: {request.bloodGroup}</div>
          </div>
          <div className="flex justify-start items-center gap-x-2 text-neutral-600 font-light text-sm">
            <MapPin size={16} className="text-rose-500" />
            <div>Location: {request.location}</div>
          </div>
          <div className="text-sm text-neutral-500 font-light">
            Notes: {request.notes}
          </div>
        </div>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Close
          </Button>
          <Button
            className="flex justify-center items-center gap-x-2"
            variant="tertiary"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
          >
            {mutation?.isPending ? "Cancelling..." : "Cancel Request"}
            {mutation?.isPending ? <Loader className="animate-spin" /> : null}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
