"use client";

import { searchDonorsWithAI } from "@/vector/services/search-vectors";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import { useState } from "react";
import Image from "next/image";

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
    <div onClick={search}>
      <HoverBorderGradient
        disabled={isLoading}
        containerClassName="rounded-full"
        as="button"
        className="dark:bg-black bg-white text-black cursor-pointer dark:text-white flex items-center space-x-2"
      >
        <Image src="/gemini.png" height={16} width={16} alt="google logo" />
        <span className="text-neutral-500 text-sm font-light">
          Search With AI
        </span>
      </HoverBorderGradient>
    </div>
  );
}
