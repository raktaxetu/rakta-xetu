"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useSearchDonors } from "@/store/search-donors";
import { SearchIcon } from "lucide-react";

export function SearchBar() {
  const { searchDonor, setSearchDonor } = useSearchDonors();
  return (
    <div className="my-4 max-w-md w-full">
      <InputGroup>
        <InputGroupInput
          placeholder="Search Donors"
          value={searchDonor}
          onChange={(e) => setSearchDonor(e.target.value)}
        />
        <InputGroupAddon>
          <SearchIcon />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
}
