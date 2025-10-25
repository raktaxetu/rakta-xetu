"use client";

import { searchDonorsWithAI } from "@/vector/services/search-vectors";
import { useState } from "react";

export function AISearch() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const search = async () => {
    try {
      setIsLoading(true);
      const results = await searchDonorsWithAI();
      console.log(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <button onClick={search} disabled={isLoading}>
      <span>Search With AI</span>
    </button>
  );
}
