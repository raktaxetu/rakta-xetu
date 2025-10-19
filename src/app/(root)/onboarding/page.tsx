import { OnboardingForm } from "@/components/modules/profile/onboarding-form";
import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";

export default function Onboarding() {
  return (
    <div className="min-h-svh w-full flex justify-center items-center overflow-x-hidden p-4">
      <div className="max-w-md w-full mx-auto">
        <div className="w-full flex flex-col justify-center items-center gap-y-3">
          <Button variant="secondary" className="pointer-events-none">
            <HeartPulse />
          </Button>
          <h1 className="text-2xl text-neutral-600 font-light">RaktaXetu</h1>
          <p className="text-neutral-400 font-light text-center">
            Complete your onboarding process
          </p>
        </div>
        <OnboardingForm />
      </div>
    </div>
  );
}
