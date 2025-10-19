import { Dot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="justify-left flex space-x-1">
      <div className="rounded-lg border shadow-xs p-2">
        <div className="flex -space-x-2.5">
          <Dot className="h-5 w-5 animate-bounce text-neutral-500" />
          <Dot className="h-5 w-5 animate-bounce [animation-delay:90ms] text-neutral-500" />
          <Dot className="h-5 w-5 animate-bounce [animation-delay:180ms] text-neutral-500" />
        </div>
      </div>
    </div>
  );
}
