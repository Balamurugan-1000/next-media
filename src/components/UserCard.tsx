import React from "react";
import Image from "next/image";
import { FollowerInfo, UserData } from "@/lib/types";
import FollowButton from "./FollowButton";
import { useSession } from "@/app/(main)/SessionProvider";
import UserTooltip from "./UserTooltip";
import Link from "next/link";

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
    followersUsers: [],
    userId: user.id,
  };

  return (
    <div className="flex w-full max-w-full flex-col items-center justify-between gap-4 rounded-lg border border-card-foreground bg-card p-4 shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-card-foreground sm:flex-row sm:items-center">
      <div className="flex w-full items-center space-x-4 sm:w-auto">
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
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted-foreground text-lg font-semibold text-card">
              {String(displayName).charAt(0).toUpperCase()}
            </div>
          </UserTooltip>
        )}

        <div className="flex flex-col">
          <Link href={`/users/${user.username}`}>
            <UserTooltip user={user}>
              <p className="text-lg font-bold text-primary sm:text-xl">
                {displayName}
              </p>
            </UserTooltip>
          </Link>
          <UserTooltip user={user}>
            <p className="text-sm text-muted-foreground sm:text-base">
              @{user.username}
            </p>
          </UserTooltip>
        </div>
      </div>

      <div className="w-full sm:w-auto">
        <FollowButton userId={user.id} initialState={followerInfo} />
      </div>
    </div>
  );
};

export default UserCard;
