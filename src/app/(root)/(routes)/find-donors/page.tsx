import { DonorsList } from "@/components/modules/donors/donors-list";
import { SearchBar } from "@/components/modules/donors/search-bar";
import { AISearch } from "@/components/modules/donors/ui/search";
import { Spinner } from "@/components/spinner";
import { fetchDonors } from "@/server/donors/fetch-donors";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function FindDonors() {
  const donors = fetchDonors();
  return (
    <div>
      <div className="flex justify-center items-center gap-x-4">
        <p className="text-neutral-500 text-2xl font-light">Find Donors</p>
        <AISearch />
      </div>
      <SearchBar />
      <Suspense
        fallback={
          <div className="flex justify-center items-center my-6">
            <Spinner />
          </div>
        }
      >
        <DonorsList donors={donors} />
      </Suspense>
    </div>
  );
}
