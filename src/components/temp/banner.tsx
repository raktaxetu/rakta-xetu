import { ClockAlert } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";

export function Banner() {
  return (
    <div className="w-full p-3 bg-rose-400 flex-col sm:flex-row text-white font-light mb-4 text-center gap-4 flex justify-center items-center rounded-md">
      <p className="text-center text-sm">
        Register for the live blood donation camp at AEC Hostel 6, Jalukbari,
        Guwahati-13
      </p>
      <Link href="https://forms.gle/6fta2hQgD8MnMob88">
        <Button
          className="flex justify-center items-center gap-x-2"
          variant="outline"
          size="sm"
        >
          <span className="text-neutral-500 font-light">Register Now</span>
          <ClockAlert className="text-neutral-500" />
        </Button>
      </Link>
    </div>
  );
}
