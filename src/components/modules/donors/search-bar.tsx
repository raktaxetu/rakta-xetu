"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAISearch } from "@/store/search-ai";
import { useSearchDonors } from "@/store/search-donors";
import { SearchIcon } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useEffect, useRef } from "react";
import { useAIMatch } from "@/store/match";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const { searchDonor, setSearchDonor } = useSearchDonors();
  const { isAISearching } = useAISearch();
  const { matches } = useAIMatch();
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      const urlSearch = searchParams.get("search") || "";
      setSearchDonor(urlSearch);
      isInitialMount.current = false;
    }
  }, [searchParams, setSearchDonor]);

  const handleSearchChange = (value: string) => {
    setSearchDonor(value);

    const isAIMode = matches && matches.length > 0;

    if (isAIMode) {
      return;
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (value.trim()) {
        params.set("search", value.trim());
      } else {
        params.delete("search");
      }

      params.delete("page");

      startTransition(() => {
        router.push(`?${params.toString()}`, { scroll: false });
      });
    }, 500);
  };

  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="my-4 max-w-md w-full">
      <InputGroup>
        <InputGroupInput
          placeholder="Search Donors by Name or Location"
          value={searchDonor}
          disabled={isAISearching || isPending}
          onChange={(e) => handleSearchChange(e.target.value)}
        />
        <InputGroupAddon>
          {isPending ? (
            <div className="animate-spin h-4 w-4 border-2 border-neutral-400 border-t-transparent rounded-full" />
          ) : (
            <SearchIcon />
          )}
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
