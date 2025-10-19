"use client";

import { useEffect, useMemo, useState, use } from "react";
import { DonorDialog } from "./ui/donor-dialog";
import { DonorCard } from "./ui/donor-card";
import { IDonor } from "../../../../types/schema";
import { useSearchDonors } from "@/store/search-donors";
import { Button } from "@/components/ui/button";

export function DonorsList({ donors }: { donors: Promise<IDonor[]> }) {
  const { searchDonor } = useSearchDonors();
  const [selectedDonor, setSelectedDonor] = useState<IDonor | null>(null);
  const [open, setOpen] = useState(false);
  const limit = 10;
  const donorsList = use(donors)
  const donorsSafe = donorsList ?? [];
  if (donorsSafe.length === 0) {
    return <p className="text-red-500 font-light">No donors are present</p>;
  }

  const handleOpen = (donor: IDonor) => {
    setSelectedDonor(donor);
    setOpen(true);
  };

  const filteredDonors = useMemo(
    () =>
      donorsSafe.filter((donor: IDonor) =>
        donor.user.name.toLowerCase().includes(searchDonor.toLowerCase())
      ),
    [donorsSafe, searchDonor]
  );

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

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 place-items-center gap-4">
        {paginatedDonors.map((donor) => (
          <DonorCard
            key={donor._id?.toString()}
            donor={donor}
            onClick={() => handleOpen(donor)}
          />
        ))}
      </div>
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
