import React from "react";
import Image from "next/image";
import { FollowerInfo, UserData } from "@/lib/types";
import FollowButton from "./FollowButton";
import { useSession } from "@/app/(main)/SessionProvider";

interface UserCardProps {
  user: UserData;
}

const UserCard = ({ user }: UserCardProps) => {
  const displayName = user.displayName || user.username || "";
  const { user: loggedInUser } = useSession();

  if (!loggedInUser) return null;

  const followerInfo: FollowerInfo = {
    followers: user._count.followers,
    isFollowedByUser: user.followers.some(
      (follower) => follower.followerId === loggedInUser.id,
    ),
  };

  return (
    <div className="flex w-full flex-col items-center justify-between rounded-md border border-gray-200 p-4 shadow-md transition-all duration-300 hover:bg-gray-100 hover:shadow-lg sm:flex-row">
      <div className="mb-4 flex items-center space-x-4 sm:mb-0">
        {user.avatarUrl ? (
          <Image
            src={user.avatarUrl}
            alt={`${displayName}'s profile picture`}
            width={48}
            height={48}
            className="rounded-full border border-gray-300 object-cover"
          />
        ) : (
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-300 text-lg font-semibold">
            {String(displayName).charAt(0).toUpperCase()}
          </div>
        )}

        <div>
          <p className="text-lg font-bold text-gray-900 sm:text-xl">
            {displayName}
          </p>
          <p className="text-sm text-gray-600 sm:text-base">@{user.username}</p>
        </div>
      </div>

      <FollowButton userId={user.id} initialState={followerInfo} />
    </div>
  );
};

export default UserCard;
