"use client";

import React, { useRef, useState } from "react";
import FollowSuggestions from "./FollowSuggestions";
import { Loader2 } from "lucide-react"; // For loading spinner icon
import { Button } from "@/components/ui/button";

// Define a type for the ref
interface FollowSuggestionsRef {
  refetchSuggestions: () => Promise<void>;
}

const Page = () => {
  const followSuggestionsRef = useRef<FollowSuggestionsRef | null>(null); // Explicitly define ref type
  const [isRefreshing, setIsRefreshing] = useState(false); // State to handle loading
  const [searchTerm, setSearchTerm] = useState(""); // State for search input

  const handleRefresh = async () => {
    if (followSuggestionsRef.current) {
      setIsRefreshing(true); // Set loading state to true
      await followSuggestionsRef.current.refetchSuggestions(); // Trigger refetch
      setIsRefreshing(false); // Reset loading state after fetch
    }
  };

  return (
    <div className="mt-0 flex min-h-screen w-full max-w-xl items-start justify-center gap-5 bg-background lg:max-w-[1100px]">
      <div className="flex w-3/4 flex-col rounded-lg border border-border bg-background p-6 shadow-md">
        <h1 className="p-5 text-3xl font-bold text-primary">
          Follow Suggestions
        </h1>
        <input
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full rounded-lg border border-input bg-card p-3 text-muted-foreground placeholder-muted-foreground shadow-sm transition duration-200 focus:border-primary focus:outline-none focus:ring focus:ring-primary/50"
        />

        <div className="flex-grow bg-background">
          <FollowSuggestions
            ref={followSuggestionsRef}
            searchTerm={searchTerm}
          />
        </div>
        <Button
          onClick={handleRefresh}
          disabled={isRefreshing} // Disable button when refreshing
          className="mt-5"
        >
          {isRefreshing ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin text-primary-foreground" />
          ) : null}
          {isRefreshing ? "Refreshing..." : "Refresh"} {/* Button label */}
        </Button>
      </div>
    </div>
  );
};

export default Page;
