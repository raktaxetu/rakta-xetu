import { HeartPulse } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogoutButton } from "../auth/logout-button";
import { Menu } from "./menu";

export function Header() {
  return (
    <header className="w-full p-4 flex justify-between items-center gap-4">
      <Link className="flex justify-center items-center gap-x-4" href="/">
        <Button variant="secondary" className="pointer-events-none">
          <HeartPulse />
        </Button>
        <p className="text-xl text-neutral-500 font-light max-sm:hidden">
          RaktaXetu
        </p>
      </Link>
      <div className="flex justify-center items-center gap-x-3">
        <Menu />
        <LogoutButton />
      </div>
    </header>
  );
}
