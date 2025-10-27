"use client";

import { useEffect, useMemo, useState, use } from "react";
import { DonorDialog } from "./ui/donor-dialog";
import { DonorCard } from "./ui/donor-card";
import { IDonor } from "../../../../types/schema";
import { useSearchDonors } from "@/store/search-donors";
import { Button } from "@/components/ui/button";
import { useAISearch } from "@/store/search-ai";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { BrainCircuit } from "lucide-react";
import { useAIMatch } from "@/store/match";

export function DonorsList({ donors }: { donors: Promise<IDonor[]> }) {
  const { isAISearching } = useAISearch();
  const { searchDonor } = useSearchDonors();
  const [selectedDonor, setSelectedDonor] = useState<IDonor | null>(null);
  const { matches, setMatches } = useAIMatch();
  const [open, setOpen] = useState(false);
  const limit = 10;
  const donorsList = use(donors);
  const donorsSafe = matches && matches.length > 0 ? matches : donorsList;
  if (donorsSafe.length === 0) {
    return <p className="text-red-500 font-light">No donors are present</p>;
  }

  const handleOpen = (donor: IDonor) => {
    setSelectedDonor(donor);
    setOpen(true);
  };

  const filteredDonors = useMemo(() => {
    const q = searchDonor.toLowerCase().trim();
    return donorsSafe.filter((donor: IDonor) => {
      const name = donor.user?.name?.toLowerCase() ?? "";
      const location = (donor.location ?? "").toLowerCase();
      return name.includes(q) || location.includes(q);
    });
  }, [donorsSafe, searchDonor]);

  const [visibleCount, setVisibleCount] = useState(limit);

  useEffect(() => {
    setVisibleCount(limit);
  }, [searchDonor, donorsSafe]);

  const paginatedDonors = useMemo(
    () => filteredDonors.slice(0, visibleCount),
    [filteredDonors, visibleCount]
  );

  useEffect(() => {
    if (!open) setSelectedDonor(null);
  }, [open]);

  if (isAISearching) {
    return (
      <div className="flex justify-start items-center gap-x-3">
        <BrainCircuit
          size={16}
          className="animate-pulse text-neutral-500 font-light"
        />
        <Shimmer className="text-sm font-light">
          Searching donors based on your profile
        </Shimmer>
      </div>
    );
  }

  return (
    <>
      {matches && matches.length > 0 && (
        <div className="my-4 text-neutral-500 font-light">
          Here are the top 10 results based on your profile
        </div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center gap-4">
        {paginatedDonors.map((donor) => (
          <DonorCard
            key={donor._id?.toString()}
            donor={donor}
            onClick={() => handleOpen(donor)}
          />
        ))}
      </div>
      {matches && matches.length > 0 && (
        <div className="flex justify-center my-4">
          <Button
            variant="outline"
            size="sm"
            className="text-sm text-neutral-500 font-light"
            onClick={() => setMatches([])}
            aria-label="Exit AI mode"
          >
            Exit from AI Mode
          </Button>
        </div>
      )}
      {filteredDonors.length > limit && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setVisibleCount((v) => Math.min(v + limit, filteredDonors.length))
            }
            disabled={visibleCount >= filteredDonors.length}
          >
            Load more
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
