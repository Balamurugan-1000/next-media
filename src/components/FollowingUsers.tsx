"use client";
import useFollowingInfo from "@/hooks/useFollowingInfo";
import React from "react";
import UserCard from "./UserCard";
import { Loader2 } from "lucide-react";

const FollowingUsers = () => {
  const { data, isLoading, error } = useFollowingInfo();

  if (isLoading) return <Loader2 className="mx-auto animate-spin" />;

  if (error)
    return <p className="text-center text-red-600">Failed to load users.</p>;

  return (
    <div className="rounded p-6 max-sm:text-xs">
      {data?.followingUsers.length === 0 ? (
        <p className="text-center text-card">No following users found.</p>
      ) : (
        <ul className="space-y-4">
          {data?.followingUsers.map((user) => (
            <li key={user.id} className="w-full">
              <UserCard user={user} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FollowingUsers;
