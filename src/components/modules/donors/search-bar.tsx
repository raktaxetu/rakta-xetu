"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useAISearch } from "@/store/search-ai";
import { useSearchDonors } from "@/store/search-donors";
import { SearchIcon } from "lucide-react";

export function SearchBar() {
  const { searchDonor, setSearchDonor } = useSearchDonors();
  const { isAISearching } = useAISearch();
  return (
    <div className="my-4 max-w-md w-full">
      <InputGroup>
        <InputGroupInput
          placeholder="Search Donors by Name or Location"
          value={searchDonor}
          disabled={isAISearching}
          onChange={(e) => setSearchDonor(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
