import { DonorsList } from "@/components/modules/donors/donors-list";
import { SearchBar } from "@/components/modules/donors/search-bar";
import { Spinner } from "@/components/spinner";
import { fetchDonors } from "@/server/donors/fetch-donors";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default function FindDonors() {
  const donors = fetchDonors();
  return (
    <div>
      <p className="text-neutral-500 text-2xl font-light">Find Donors</p>
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
