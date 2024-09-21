"use client";

import { useSession } from "@/app/(main)/SessionProvider";
import useFollowerInfo from "@/hooks/useFollowerInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
  loggedInUserId: string;
}
const FollowersCount = ({
  initialState,
  userId,
  loggedInUserId,
}: FollowerCountProps) => {
  const { data } = useFollowerInfo(userId, initialState);

  const { user } = useSession();
  if (loggedInUserId && loggedInUserId == userId) {
    return (
      <Link href={`/followers`}>
        <span>
          Followers:{"  "}{" "}
          <span className="font-semibold">{formatNumber(data.followers)}</span>
        </span>
      </Link>
    );
  } else {
    return (
      <span>
        Followers:{"  "}{" "}
        <span className="font-semibold">{formatNumber(data.followers)}</span>
      </span>
    );
  }
};

export default FollowersCount;
