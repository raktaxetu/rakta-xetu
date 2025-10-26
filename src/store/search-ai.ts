"use client";

import { create } from "zustand";

type AISearch = {
  isAISearching: boolean;
  setIsAISearching: (condition: boolean) => void;
};

export const useAISearch = create<AISearch>((set) => ({
  isAISearching: false,
  setIsAISearching: (condition) => set({ isAISearching: condition }),
}));
