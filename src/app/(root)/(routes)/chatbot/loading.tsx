import { Button } from "@/components/ui/button";
import { HeartPulse } from "lucide-react";

export default function Loading() {
  return (
    <div className="my-36 w-full flex justify-center items-center">
      <Button variant="secondary" className="pointer-events-none animate-pulse">
        <HeartPulse />
      </Button>
    </div>
  );
}
