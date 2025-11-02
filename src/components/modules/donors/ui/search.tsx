"use client";

import { searchDonorsWithAI } from "@/vector/services/search-vectors";
import { HoverBorderGradient } from "@/components/ui/hover-border-gradient";
import Image from "next/image";
import { useAISearch } from "@/store/search-ai";
import { cn } from "@/lib/utils";
import { Shimmer } from "@/components/ai-elements/shimmer";
import { useAIMatch } from "@/store/match";
import { toast } from "sonner";

export function AISearch() {
  const { isAISearching, setIsAISearching } = useAISearch();
  const { setMatches } = useAIMatch();
  const search = async () => {
    try {
      setIsAISearching(true);
      const results = await searchDonorsWithAI();
      if (results?.hasMatchedProfiles === false) {
        toast("We couldn't find any matches based on your profile");
        setMatches([]);
        return;
      }
      setMatches(results);
    } catch (error) {
      console.error(error);
    } finally {
      setIsAISearching(false);
    }
  };
  return (
    <div onClick={search}>
      <HoverBorderGradient
        disabled={isAISearching}
        containerClassName="rounded-full"
        as="button"
        className={cn(
          "dark:bg-black bg-white text-black cursor-pointer dark:text-white flex items-center space-x-2"
        )}
      >
        <Image
          src="/gemini.png"
          height={16}
          width={16}
          alt="google logo"
          className={cn(isAISearching && "animate-spin-with-pause")}
        />
        {isAISearching ? (
          <Shimmer className="text-sm font-light">Searching...</Shimmer>
        ) : (
          <span className="text-neutral-500 text-sm font-light">
            Search With AI
          </span>
        )}
      </HoverBorderGradient>
    </div>
  );
}
