"use client";

import useFollowingInfo from "@/hooks/useFollowingInfo";
import { formatNumber } from "@/lib/utils";
import Link from "next/link";

const FollowingCount = ({
  loggedInUserId,
  userId,
}: {
  loggedInUserId: string;
  userId: string;
}) => {
  let { data } = useFollowingInfo();

  {
    if (loggedInUserId && loggedInUserId == userId) {
      return (
        <Link href="/following">
          <span>
            Following:{"  "}{" "}
            <span className="font-semibold">
              {formatNumber(data?.followingCount || 0)}
            </span>
          </span>
        </Link>
      );
    } else {
      return (
        <span>
          Following:{"  "}{" "}
          <span className="font-semibold">
            {formatNumber(data?.followingCount || 0)}
          </span>
        </span>
      );
    }
  }
};

export default FollowingCount;
