"use client";

import useFollowerInfo from "@/hooks/useFollowerInfo";
import useFollowingInfo from "@/hooks/useFollowingInfo";
import { FollowerInfo } from "@/lib/types";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

interface FollowerCountProps {
  userId: string;
  initialState: FollowerInfo;
}

interface FollowingCountProps {
  params: {
    username: string;
  };
}
const FollowersCount = () => {
  let { data } = useFollowingInfo();

  return (
    <Link href="/following">
      <span>
        Followers:{"  "}{" "}
        <span className="font-semibold">
          {formatNumber(data?.followingCount || 0)}
        </span>
      </span>
    </Link>
  );
};

export default FollowersCount;
