"use client";

import { useEffect, useMemo, useState, use, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { DonorDialog } from "./ui/donor-dialog";
import { DonorCard } from "./ui/donor-card";
import { IDonor } from "../../../../types/schema";
import { useSearchDonors } from "@/store/search-donors";
import { Button } from "@/components/ui/button";
import { useAISearch } from "@/store/search-ai";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useAIMatch } from "@/store/match";

interface DonorsListProps {
  donors: Promise<{
    donors: IDonor[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    hasMore: boolean;
  }>;
  searchQuery: string;
  currentPage: number;
}

export function DonorsList({
  donors,
  searchQuery,
  currentPage,
}: DonorsListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const { isAISearching } = useAISearch();
  const { searchDonor } = useSearchDonors();
  const [selectedDonor, setSelectedDonor] = useState<IDonor | null>(null);
  const { matches, setMatches } = useAIMatch();
  const [open, setOpen] = useState(false);

  const donorsData = use(donors);
  const { donors: donorsList, totalCount, hasMore } = donorsData;

  const isAIMode = matches && matches.length > 0;
  const displayDonors = isAIMode ? matches : donorsList;

  const filteredDonors = useMemo(() => {
    if (isAIMode && searchDonor.trim()) {
      const q = searchDonor.toLowerCase().trim();
      return displayDonors.filter((donor: IDonor) => {
        const name = donor.user?.name?.toLowerCase() ?? "";
        const location = (donor.location ?? "").toLowerCase();
        return name.includes(q) || location.includes(q);
      });
    }

    return displayDonors;
  }, [displayDonors, searchDonor, isAIMode]);

  const handleOpen = (donor: IDonor) => {
    setSelectedDonor(donor);
    setOpen(true);
  };

  const handleLoadMore = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(currentPage + 1));
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  const handlePrevPage = () => {
    if (currentPage <= 1) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(currentPage - 1));
    if (searchQuery) {
      params.set("search", searchQuery);
    }

    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: true });
    });
  };

  const handleExitAIMode = () => {
    setMatches([]);
    const params = new URLSearchParams();
    startTransition(() => {
      router.push(`?${params.toString()}`, { scroll: false });
    });
  };

  useEffect(() => {
    if (!open) setSelectedDonor(null);
  }, [open]);

  if (isAISearching) {
    return (
      <Shimmer className="font-light">
        Searching donors based on your profile
      </Shimmer>
    );
  }

  if (filteredDonors.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-neutral-500 font-light">
          {isAIMode
            ? "No matching donors found in AI results. Try adjusting your search."
            : searchQuery
              ? `No donors found matching "${searchQuery}"`
              : "No donors are present"}
        </p>
      </div>
    );
  }

  return (
    <>
      {isAIMode && (
        <div className="my-4 text-neutral-500 font-light">
          Here are the top matches based on your profile.
        </div>
      )}

      {!isAIMode && totalCount > 0 && (
        <div className="my-4 text-neutral-500 font-light text-sm">
          Showing {filteredDonors.length} of {totalCount} donors
          {searchQuery && ` matching "${searchQuery}"`}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center gap-4">
        {filteredDonors.map((donor) => (
          <DonorCard
            key={donor._id?.toString() ?? Math.random()}
            donor={donor}
            onClick={() => handleOpen(donor)}
          />
        ))}
      </div>

      {isAIMode && (
        <div className="flex justify-center my-4">
          <Button
            variant="outline"
            size="sm"
            className="text-sm text-neutral-500 font-light"
            onClick={handleExitAIMode}
            aria-label="Exit AI mode"
            disabled={isPending}
          >
            Exit from AI Mode
          </Button>
        </div>
      )}

      {!isAIMode && (hasMore || currentPage > 1) && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handlePrevPage}
            disabled={isPending || currentPage <= 1}
          >
            {isPending ? "Loading..." : "Previous"}
          </Button>
          <span className="text-sm text-neutral-500 font-light px-2">
            Page {currentPage}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLoadMore}
            disabled={isPending || !hasMore}
          >
            {isPending ? "Loading..." : "Next"}
          </Button>
        </div>
      )}

      {selectedDonor && (
        <DonorDialog
          donor={selectedDonor}
          open={open}
          setOpen={setOpen}
          onOpenChange={setOpen}
        />
      )}
    </>
  );
}
