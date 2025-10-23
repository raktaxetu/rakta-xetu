"use client";

import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { MyRequestCard } from "./ui/my-request-card";
import { MyRequestDialog } from "./ui/my-request-dialog";
import { IBlood } from "../../../../types/schema";
import { Button } from "@/components/ui/button";
import { myRequests } from "@/server/request/my-requests";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

interface Props {}

const PAGE_SIZE = 10;

function MyRequestsSkeleton() {
  return (
    <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pb-4">
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <Skeleton key={i} className="h-20 w-full" />
      ))}
    </div>
  );
}

export function MyRequestsList({}: Props) {
  const [selected, setSelected] = useState<IBlood | null>(null);
  const [open, setOpen] = useState(false);
  const [isAcceptedFilter, setIsAcceptedFilter] = useState<boolean | null>(
    null
  );
  const [isCriticalFilter, setIsCriticalFilter] = useState<boolean | null>(
    null
  );

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: [
      "myRequests",
      { isAccepted: isAcceptedFilter, isCritical: isCriticalFilter },
    ],
    queryFn: ({ pageParam = 1 }) =>
      myRequests({
        isAccepted: isAcceptedFilter,
        isCritical: isCriticalFilter,
        limit: PAGE_SIZE,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalPages = Math.ceil(lastPage.totalCount / PAGE_SIZE);
      const nextPage = allPages.length + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
  });

  const requestsList = data?.pages?.flatMap((page: any) => page.requests || []) || [];
  const totalCount = data?.pages?.[0]?.totalCount || 0;

  const handleFilterChange = (
    setter: (val: boolean | null) => void,
    val: string
  ) => {
    setter(val === "all" ? null : val === "true");
  };

  if (isError) {
    return (
      <div className="my-4">
        <p className="text-rose-600 font-light">
          Error fetching requests
        </p>
      </div>
    );
  }

  const isQuerying = isLoading || isRefetching;

  return (
    <div className="my-4 w-full">
      <div className="flex gap-4 items-center mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-neutral-500 font-light">
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
                  handleFilterChange(setIsAcceptedFilter, val)
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
                  handleFilterChange(setIsCriticalFilter, val)
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

      {isQuerying && requestsList.length === 0 ? (
        <MyRequestsSkeleton />
      ) : requestsList.length === 0 ? (
        <div className="my-4">
          <p className="text-rose-500 font-light">No requests found</p>
        </div>
      ) : (
        <>
          <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 justify-center items-center">
            {requestsList.map((request: IBlood) => (
              <MyRequestCard
                key={request._id?.toString()}
                request={request}
                onClick={() => {
                  setSelected(request);
                  setOpen(true);
                }}
              />
            ))}
          </div>
          {(hasNextPage || isFetchingNextPage) && (
            <div className="flex justify-center items-center my-4">
              <Button
                variant="outline"
                size="sm"
                disabled={isFetchingNextPage}
                onClick={() => fetchNextPage()}
              >
                {isFetchingNextPage
                  ? "Loading More..."
                  : `Load More (${requestsList.length} of ${totalCount})`}
              </Button>
            </div>
          )}
        </>
      )}
      {selected && (
        <MyRequestDialog
          request={selected}
          open={open}
          setOpen={setOpen}
          onOpenChange={(val: boolean) => setOpen(val)}
        />
      )}
    </div>
  );
}
