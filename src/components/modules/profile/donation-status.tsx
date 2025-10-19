"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { authClient } from "@/lib/auth-client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export function DonationStatus() {
  const { data: session } = authClient.useSession();
  const mutation = useMutation({
    mutationKey: ["donation"],
    mutationFn: async (isDonor: any) => {
      await authClient.updateUser({
        isDonor: !isDonor,
      } as any);
    },
    onSuccess: () => {
      toast.success("Status Updated Successfully");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Some Error Occurred");
    },
  });

  return (
    <div className="my-2 text-center flex justify-center items-center gap-x-4">
      <p className="text-neutral-500 font-light">Available For Donation</p>
      {!session ? (
        <Skeleton className="w-12 h-4" />
      ) : (
        <Switch
          onCheckedChange={() =>
            mutation.mutate((session.user as { isDonor?: boolean })?.isDonor)
          }
          checked={Boolean((session.user as { isDonor?: boolean })?.isDonor)}
          className="[&_span]:border-input h-3 w-9 border-none outline-offset-[6px] [&_span]:border"
        />
      )}
    </div>
  );
}
