"use client";

import UserCard from "@/components/UserCard";
import kyInstance from "@/lib/ky";
import { UserData } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { forwardRef, useImperativeHandle } from "react";

interface FollowSuggestionsProps {
  searchTerm: string; // Add searchTerm prop
}

const FollowSuggestions = forwardRef<unknown, FollowSuggestionsProps>(
  function FollowSuggestions({ searchTerm }, ref) {
    let searchTerm1 = slugify(searchTerm);
    const { data, status, refetch, isLoading } = useQuery({
      queryKey: ["follow-suggestions", searchTerm1],
      queryFn: () =>
        kyInstance
          .get(`/api/follow-suggestions?search=${searchTerm1}`)
          .json<UserData[]>(),
      refetchOnWindowFocus: true,
      staleTime: 0,
    });

    useImperativeHandle(ref, () => ({
      refetchSuggestions: refetch,
    }));

    const suggestions = data || [];

    const renderLoading = () => <Loader2 className="mx-auto animate-spin" />;
    const renderError = () => (
      <p className="text-center text-destructive">
        An error occurred while fetching follow suggestions
      </p>
    );
    const renderEmpty = () => (
      <p className="text-center text-muted-foreground">
        No follow suggestions available
      </p>
    );
    const renderSuggestions = () => (
      <div className="space-y-5">
        {suggestions.map((user) => (
          <div key={user.id} className="w-full">
            <UserCard user={user} />
          </div>
        ))}
      </div>
    );

    if (isLoading) return renderLoading();

    switch (status) {
      case "error":
        return renderError();
      case "success":
        return suggestions.length ? renderSuggestions() : renderEmpty();
      default:
        return null;
    }
  },
);

export default FollowSuggestions;
