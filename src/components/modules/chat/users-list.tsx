"use client";

import { useEffect, useState } from "react";
import { IUser } from "../../../../types/schema";
import initials from "initials";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UsersList({ users }: { users: IUser[] }) {
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <div className="max-w-xl mx-auto flex justify-start w-full items-center">
      <Button
        variant="secondary"
        className="flex justify-center items-center gap-x-2"
        onClick={() => setOpen(true)}
      >
        <span>Find a User</span>
        <Users />
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen} className="w-[400px]">
        <CommandInput
          placeholder="Type a command or search..."
          className="placeholder:font-light placeholder:text-neutral-500"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Users">
            {users.map((user: IUser) => (
              <CommandItem
                asChild
                className="cursor-pointer"
                key={user._id?.toString()}
              >
                <Link
                  href={`/chat/${user._id?.toString()}`}
                  className="flex justify-start items-center gap-x-4"
                >
                  <Avatar>
                    <AvatarImage src={user.image || ""} />
                    <AvatarFallback>{initials(user.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start justify-between">
                    <p className="text-sm text-neutral-500 font-light">
                      {user.name}
                    </p>
                    <p className="text-xs text-neutral-400 font-extralight">
                      {user.email}
                    </p>
                  </div>
                </Link>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </div>
  );
}
