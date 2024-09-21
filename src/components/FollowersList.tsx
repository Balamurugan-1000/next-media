"use client";
import useFollowingInfo from "@/hooks/useFollowingInfo";
import React from "react";
import UserCard from "./UserCard";
import { Loader2 } from "lucide-react";
import useFollowerListInfo from "@/hooks/useFollowersListInfo";

const FollowingUsers = () => {
  const { data, isLoading, error } = useFollowerListInfo();

  if (isLoading) return <Loader2 className="mx-auto animate-spin" />;
  console.log(data);
  if (error)
    return <p className="text-center text-red-600">Failed to load users.</p>;

  return (
    <div className="rounded p-6 max-sm:text-xs">
      {data?.followersUsers?.length === 0 ? (
        <p className="text-center text-card">No followers found.</p>
      ) : (
        <ul className="space-y-4">
          {data?.followersUsers?.map((user) => (
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
