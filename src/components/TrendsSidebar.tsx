import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { unstable_cache } from "next/cache";
import { formatNumber } from "@/lib/utils";
import FollowButton from "./FollowButton";
import { getUserDataSelect } from "@/lib/types";
import UserTooltip from "./UserTooltip";

const TrendsSidebar = () => {
  return (
    <div className="sticky top-[5.25rem] hidden h-fit w-72 flex-none space-y-5 md:block lg:w-80">
      <Suspense
        fallback={<Loader2 className="mx-auto animate-spin text-primary" />}
      >
        <WhoToFollow />
        <TrendingTopics />
      </Suspense>
    </div>
  );
};

export default TrendsSidebar;

const WhoToFollow = async () => {
  const { user } = await validateRequest();

  if (!user) return null;
  const usersToFollow = await prisma.user.findMany({
    where: {
      NOT: {
        id: user?.id,
      },
      followers: {
        none: {
          followerId: user.id,
        },
      },
    },
    select: getUserDataSelect(user.id),
    take: 5,
  });

  return (
    <div className="space-y-5 rounded-2xl bg-card p-5 shadow-sm">
      <h1 className="text-xl font-bold">Following suggestions</h1>
      {usersToFollow.map((user) => (
        <div className="flex items-center justify-between gap-3" key={user.id}>
          <UserTooltip user={user}>
            <Link
              href={`/users/${user.username}`}
              className="flex items-center gap-3"
            >
              <UserAvatar avatarurl={user.avatarUrl} className="flex-none" />
              <div className="">
                <p className="line-clamp-1 break-all font-semibold">
                  {user.displayName}
                </p>
                <p className="line-clamp-1 break-all font-medium text-muted-foreground">
                  @{user.username}
                </p>
              </div>
            </Link>
          </UserTooltip>

          <FollowButton
            userId={user.id}
            initialState={{
              followers: user._count.followers,
              isFollowedByUser: user.followers.some(
                ({ followerId }) => followerId === user.id,
              ),
            }}
          />
        </div>
      ))}{" "}
    </div>
  );
};

const getTrendingTopics = unstable_cache(
  async () => {
    const result = await prisma.$queryRaw<{ hashtag: string; count: bigint }[]>`
            SELECT LOWER(unnest(regexp_matches(content, '#[[:alnum:]_]+', 'g'))) AS hashtag, COUNT(*) AS count
            FROM posts
            GROUP BY (hashtag)
            ORDER BY count DESC
            LIMIT 5
        `;

    return result.map((row) => ({
      hashtag: row.hashtag,

      count: Number(row.count),
    }));
  },
  ["trending_topics"],
  {
    revalidate: 1 * 60 * 60,
  },
);

const TrendingTopics = async () => {
  const trendingTopics = await getTrendingTopics();
  return (
    <div className="space-y-5 rounded-xl bg-card p-5 shadow-sm">
      <h1 className="text-xl font-bold">TrendingTopics</h1>
      <div className="gap-5 space-y-5 text-xl font-bold">
        {trendingTopics.map(({ hashtag, count }) => {
          const title = hashtag.split("#")[1];
          return (
            <Link href={`/hashtags/${title}`} key={title} className="block">
              <p
                className="line-clamp-1 break-all font-semibold hover:underline"
                title={hashtag}
              >
                {hashtag}
              </p>
              <p className="text-sm text-muted-foreground">
                {formatNumber(count)} {count == 1 ? "post" : "posts"}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
