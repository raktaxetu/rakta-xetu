import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { HeartPulse, TriangleAlert } from "lucide-react";

export default function Complaint() {
  return (
    <div className="w-full">
      <div className="max-w-md mx-auto w-full flex flex-col gap-y-3 justify-center items-center my-24">
        <Button variant="secondary" className="pointer-events-none">
          <HeartPulse />
        </Button>
        <h1 className="text-2xl text-neutral-600 font-light">
          Make a Complaint
        </h1>
        <p className="text-neutral-400 font-light text-center">
          Your anonymity is our priority
        </p>
        <form
          className="w-full flex flex-col gap-y-3 justify-center items-center my-4"
          action="https://api.web3forms.com/submit"
          method="POST"
        >
          <input
            type="hidden"
            name="access_key"
            value={process.env.ACCESS_KEY!}
          />
          <Textarea
            name="complaint"
            placeholder="Write Your Complaint"
            className="placeholder:font-light min-h-32 w-full text-neutral-500 font-light"
          />
          <Button
            className="flex justify-center items-center gap-x-2"
            variant="secondary"
          >
            <span>Submit Complaint</span>
            <TriangleAlert />
          </Button>
        </form>
      </div>
    </div>
  );
}
