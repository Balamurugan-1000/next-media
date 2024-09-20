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
  const followSuggestionsRef = useRef(null);
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
    <div className="mt-0 flex min-h-screen w-full max-w-xl items-start justify-center gap-5 bg-gray-100 lg:max-w-[1100px]">
      <div className="mt-[-10] flex w-3/4 flex-col rounded-lg bg-white p-6 shadow-md">
        <input
          type="text"
          placeholder="Search for users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-300 bg-gray-50 p-3 text-gray-700 placeholder-gray-400 shadow-sm transition duration-200 focus:border-blue-500 focus:outline-none focus:ring focus:ring-blue-200"
        />

        <div className="flex-grow">
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
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> // Spinner icon when loading
          ) : null}
          {isRefreshing ? "Refreshing..." : "Refresh"} {/* Button label */}
        </Button>
      </div>
    </div>
  );
};

export default Page;
