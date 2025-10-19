import { HeartPulse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DonationForm } from "@/components/modules/donation/donation-form";

export default function DonateUs() {
  return (
    <div className="w-full my-16 flex justify-center items-center">
      <div className="max-w-sm mx-auto w-full flex flex-col gap-y-3 justify-center items-center">
        <Button variant="secondary" className="pointer-events-none">
          <HeartPulse />
        </Button>
        <h1 className="text-2xl text-neutral-600 font-light">RaktaXetu</h1>
        <p className="text-neutral-400 font-light text-center">
          Power RaktaXetu with your donation
        </p>
        <DonationForm />
      </div>
    </div>
  );
}
