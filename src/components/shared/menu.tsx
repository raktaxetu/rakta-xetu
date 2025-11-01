"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Button } from "../ui/button";
import { menuItems } from "@/lib/constants";
import { MenuIcon } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "../ui/skeleton";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function Menu() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <MenuIcon className="text-neutral-600" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel className="text-neutral-600 font-normal">
          {!session ? (
            <Skeleton className="h-3 w-[160px]" />
          ) : (
            session.user.email
          )}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {menuItems.map((item) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);
          return (
            <DropdownMenuItem
              key={item.path}
              className={cn(
                "text-neutral-500 font-light cursor-pointer",
                isActive && "text-rose-500 focus:text-rose-700 focus:bg-rose-50"
              )}
              asChild
            >
              <Link
                href={item.path}
                className="flex justify-start items-center gap-x-2"
              >
                <item.icon className={cn(isActive && "text-rose-500")} />
                {item.label}
              </Link>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
