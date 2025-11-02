import { DonorsList } from "@/components/modules/donors/donors-list";
import { SearchBar } from "@/components/modules/donors/search-bar";
import { AISearch } from "@/components/modules/donors/ui/search";
import { Spinner } from "@/components/spinner";
import { fetchDonors } from "@/server/donors/fetch-donors";
import { Suspense } from "react";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

interface SearchParams {
  search?: string;
  page?: string;
}

export default async function FindDonors({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const search = (await searchParams).search || "";
  const page = parseInt((await searchParams).page || "1", 10);

  const donors = fetchDonors({ search, page, limit: 10 });

  return (
    <div>
      <div className="flex flex-col justify-start items-start gap-4">
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
        <div className="pb-4">
          <DonorsList donors={donors} searchQuery={search} currentPage={page} />
        </div>
      </Suspense>
    </div>
  );
}
