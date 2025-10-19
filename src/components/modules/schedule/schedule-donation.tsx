"use client";
import { Button } from "@/components/ui/button";
import { Loader, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { DateField, DateInput } from "@/components/ui/datefield-rac";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { saveEvent } from "@/server/schedule/calendar";
import { toast } from "sonner";
import { AccessScope } from "./access-scope";

type DateValueShape = {
  year: number;
  month: number;
  day: number;
  hour?: number;
  minute?: number;
};

function dateValueToDate(val: DateValueShape | null | undefined): Date | null {
  if (!val) return null;
  const { year, month, day, hour = 0, minute = 0 } = val as DateValueShape;
  if (
    typeof year !== "number" ||
    typeof month !== "number" ||
    typeof day !== "number"
  )
    return null;
  return new Date(year, month - 1, day, hour ?? 0, minute ?? 0, 0, 0);
}

const formSchema = z.object({
  hospitalName: z.string().min(1, { message: "Hospital name is required" }),
  donationTime: z
    .any()
    .refine(
      (val) => {
        const date = dateValueToDate(val as DateValueShape | null | undefined);
        return date !== null;
      },
      { message: "Donation date and time is required" }
    )
    .refine(
      (val) => {
        const date = dateValueToDate(val as DateValueShape | null | undefined);
        return date ? date.getTime() > Date.now() : false;
      },
      { message: "Donation date and time cannot be in the past" }
    ),
});

export function ScheduleDonation() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hospitalName: "",
      donationTime: null,
    },
  });

  const mutation = useMutation({
    mutationFn: async (vars: { hospitalName: string; donationTime: any }) => {
      const { hospitalName, donationTime } = vars;
      const response = await saveEvent(hospitalName, donationTime);
      if (response?.hasScope === false) {
        setOpen(true);
        return response?.hasScope;
      }
    },
    onError: (error) => {
      console.log(error);
      toast.error("Some Error Occurred");
    },
    onSuccess: (data) => {
      if (data === false) return;
      toast.success("Scheduled your event successfully");
      form.reset();
      setOpenDialog(false);
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const scheduled = dateValueToDate(
      values.donationTime as DateValueShape | null
    );
    if (!scheduled) {
      toast.error("No valid donationTime provided");
      return;
    }
    mutation.mutate({
      hospitalName: values.hospitalName,
      donationTime: scheduled as any,
    });
  };

  return (
    <div className="my-4">
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogTrigger asChild>
          <Button
            className="flex justify-center items-center gap-x-2"
            variant="secondary"
          >
            <span>Schedule Donation</span>
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent className="w-[400px]">
          <DialogHeader>
            <DialogTitle className="font-normal text-neutral-600">
              Schedule your next donation
            </DialogTitle>
            <DialogDescription className="font-light text-neutral-500">
              It will automatically schedule your donation in Google Calendar
              and send you a confirmation email.
            </DialogDescription>
          </DialogHeader>
          <AccessScope open={open} setOpen={setOpen} />
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="hospitalName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-light">Hospital Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Apollo Hospitals" {...field} />
                    </FormControl>
                    <FormDescription className="font-light">
                      Enter your hospital name
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="donationTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-light">
                      Schedule Donation
                    </FormLabel>
                    <FormControl>
                      <DateField
                        className="*:not-first:mt-2"
                        granularity="minute"
                        hourCycle={24}
                        {...field}
                      >
                        <DateInput />
                      </DateField>
                    </FormControl>
                    <FormDescription className="font-light">
                      Enter the donation date and time
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                variant="secondary"
                className="w-full"
                disabled={mutation.isPending}
              >
                {mutation.isPending ? (
                  <Loader className="animate-spin" />
                ) : (
                  "Submit"
                )}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
