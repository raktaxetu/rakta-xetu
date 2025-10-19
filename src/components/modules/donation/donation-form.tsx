"use client";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { Coins } from "lucide-react";
import { toast } from "sonner";
import { createOrder, verifyPayment } from "@/server/donation/donation";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  amount: z.coerce
    .number({ message: "Please enter an amount" })
    .nonnegative({ message: "Please enter a valid amount" })
    .min(10, { message: "Minimum donation is 10 Rupees" }),
});

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") return resolve(false);
    if ((window as any).Razorpay) return resolve(true);
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function DonationForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema) as Resolver<
      z.infer<typeof formSchema>,
      any
    >,
    defaultValues: {
      amount: 50,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      toast.error("Failed to load razorpay");
      return;
    }
    const result = await createOrder(values.amount);
    const options = {
      key: result.key,
      amount: result.amount,
      currency: result.currency,
      name: "RaktaXetu",
      description: "Donation",
      order_id: result.orderId,
      prefill: { name: result.name, email: result.email },
      handler: async function (response: any) {
        const res = await verifyPayment({
          ...response,
          donorName: result.name,
          donorEmail: result.email,
          amount: values.amount,
        });
        if (res?.ok) {
          toast.success("Thank you — donation verified!");
          router.push("/");
        } else {
          toast.error("Payment verification failed. Please contact support");
          router.push("/complaint");
        }
      },
      modal: {},
    };
    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  };

  return (
    <div className="w-full my-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="amount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-light text-neutral-500">
                  Donation Amount
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter an amount"
                    {...field}
                    type="number"
                    className="no-spinner"
                  />
                </FormControl>
                <FormDescription className="font-light text-neutral-500">
                  This is your amount in Indian Rupees.
                </FormDescription>
                <FormMessage className="font-light" />
              </FormItem>
            )}
          />
          <div className="w-full flex justify-center items-center">
            <Button
              type="submit"
              variant="secondary"
              className="flex justify-center items-center gap-x-2"
            >
              <span>Donate Now</span>
              <Coins />
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
