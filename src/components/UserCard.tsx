import React from "react";
import Image from "next/image";
import { FollowerInfo, UserData } from "@/lib/types";
import FollowButton from "./FollowButton";
import { useSession } from "@/app/(main)/SessionProvider";
import UserTooltip from "./UserTooltip";

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
    <div className="flex w-full flex-col items-center justify-between rounded-md border border-primary-foreground bg-card p-4 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-card-foreground sm:flex-row">
      <div className="mb-4 flex items-center space-x-4 sm:mb-0">
        {user.avatarUrl ? (
          <UserTooltip user={user}>
            <Image
              src={user.avatarUrl}
              alt={`${displayName}'s profile picture`}
              width={48}
              height={48}
              className="rounded-full border border-card object-cover"
            />
          </UserTooltip>
        ) : (
          <UserTooltip user={user}>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-card-foreground text-lg font-semibold text-card">
              {String(displayName).charAt(0).toUpperCase()}
            </div>
          </UserTooltip>
        )}

        <div>
          <UserTooltip user={user}>
            <p className="text-lg font-bold text-muted-foreground sm:text-xl">
              {displayName}
            </p>
          </UserTooltip>
          <UserTooltip user={user}>
            <p className="text-sm text-muted-foreground sm:text-base">
              @{user.username}
            </p>
          </UserTooltip>
        </div>
      </div>

      <FollowButton userId={user.id} initialState={followerInfo} />
    </div>
  );
};

export default UserCard;
