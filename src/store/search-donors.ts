"use client";

import { create } from "zustand";

type Donor = {
  searchDonor: string;
  setSearchDonor: (term: string) => void;
};

export const useSearchDonors = create<Donor>((set) => ({
  searchDonor: "",
  setSearchDonor: (term) => set({ searchDonor: term }),
}));
