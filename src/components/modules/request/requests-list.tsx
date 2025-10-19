"use client";

import { useState, useEffect, use } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { RequestCard } from "./ui/request-card";
import { RequestDialog } from "./ui/request-dialog";
import { IBlood } from "../../../../types/schema";
import { Button } from "@/components/ui/button";

interface Props {
  requests: Promise<IBlood[]>;
  initialIsAccepted?: boolean | null;
  initialIsCritical?: boolean | null;
}

export function RequestsList({
  requests,
  initialIsAccepted = null,
  initialIsCritical = null,
}: Props) {
  const [selected, setSelected] = useState<IBlood | null>(null);
  const [open, setOpen] = useState(false);
  const [isAcceptedFilter, setIsAcceptedFilter] = useState<boolean | null>(
    initialIsAccepted
  );
  const [isCriticalFilter, setIsCriticalFilter] = useState<boolean | null>(
    initialIsCritical
  );
  const requestsList = use(requests);
  const filtered = requestsList.filter((r) => {
    if (
      typeof isAcceptedFilter === "boolean" &&
      r.isAccepted !== isAcceptedFilter
    )
      return false;
    if (
      typeof isCriticalFilter === "boolean" &&
      r.isCritical !== isCriticalFilter
    )
      return false;
    return true;
  });

  const [visibleCount, setVisibleCount] = useState(10);

  useEffect(() => {
    setVisibleCount(10);
  }, [isAcceptedFilter, isCriticalFilter, requests]);

  return (
    <div className="my-4 w-full">
      <div className="flex gap-4 items-center mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-light text-neutral-500">
            Accepted:
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger className="border cursor-pointer rounded px-2 py-1 text-sm text-neutral-500 font-light">
              {typeof isAcceptedFilter === "boolean"
                ? isAcceptedFilter
                  ? "Accepted"
                  : "Not accepted"
                : "All"}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={
                  typeof isAcceptedFilter === "boolean"
                    ? isAcceptedFilter
                      ? "true"
                      : "false"
                    : "all"
                }
                onValueChange={(val: string) =>
                  setIsAcceptedFilter(val === "all" ? null : val === "true")
                }
              >
                <DropdownMenuRadioItem
                  value="all"
                  className="text-neutral-500 font-light cursor-pointer"
                >
                  All
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="true"
                  className="text-neutral-500 font-light cursor-pointer"
                >
                  Accepted
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="false"
                  className="text-neutral-500 font-light cursor-pointer"
                >
                  Not accepted
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-500 font-light">
            Critical:
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger className="border cursor-pointer rounded px-2 py-1 text-sm text-neutral-500 font-light">
              {typeof isCriticalFilter === "boolean"
                ? isCriticalFilter
                  ? "Critical"
                  : "Not critical"
                : "All"}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuRadioGroup
                value={
                  typeof isCriticalFilter === "boolean"
                    ? isCriticalFilter
                      ? "true"
                      : "false"
                    : "all"
                }
                onValueChange={(val: string) =>
                  setIsCriticalFilter(val === "all" ? null : val === "true")
                }
              >
                <DropdownMenuRadioItem
                  value="all"
                  className="text-neutral-500 font-light cursor-pointer"
                >
                  All
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="true"
                  className="text-neutral-500 font-light cursor-pointer"
                >
                  Critical
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="false"
                  className="text-neutral-500 font-light cursor-pointer"
                >
                  Not critical
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="my-4">
          <p className="text-rose-500 font-light">No requests found</p>
        </div>
      ) : (
        <>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-center">
            {filtered.slice(0, visibleCount).map((request: IBlood) => (
              <RequestCard
                key={request._id?.toString()}
                request={request}
                onClick={() => {
                  setSelected(request);
                  setOpen(true);
                }}
              />
            ))}
          </div>
          {visibleCount < filtered.length && (
            <div className="flex justify-center items-center my-4">
              <Button
                variant="outline"
                size="sm"
                disabled={visibleCount >= filtered.length}
                onClick={() =>
                  setVisibleCount((v) => Math.min(v + 10, filtered.length))
                }
              >
                Load More
              </Button>
            </div>
          )}
        </>
      )}
      {selected && (
        <RequestDialog
          request={selected}
          open={open}
          setOpen={setOpen}
          onOpenChange={(val: boolean) => setOpen(val)}
        />
      )}
    </div>
  );
}
