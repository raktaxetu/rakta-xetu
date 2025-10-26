"use client";

import { IDonor } from "../../types/schema";
import { create } from "zustand";

type Match = {
  matches: IDonor[];
  setMatches: (matches: IDonor[]) => void;
};

export const useAIMatch = create<Match>((set) => ({
  matches: [],
  setMatches: (matches: IDonor[]) => set({ matches: matches }),
}));
