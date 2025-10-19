"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { DialogClose } from "@radix-ui/react-dialog";
import React from "react";

interface Props {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export function AccessScope({ open, setOpen }: Props) {
  const grantAccess = async () => {
    await authClient.linkSocial({
      provider: "google",
      scopes: ["https://www.googleapis.com/auth/calendar"],
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-normal text-neutral-600">
            Google Calendar Access Required
          </DialogTitle>
          <DialogDescription className="font-light text-neutral-500">
            You have not granted access to your Google Calendar during signup.
            Please allow calendar access to enable automatic event scheduling.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
          <Button type="submit" variant="secondary" onClick={grantAccess}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
