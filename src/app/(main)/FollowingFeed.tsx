"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import React from "react";
import { useSession } from "./SessionProvider";
import kyInstance from "@/lib/ky";
import { PostData, PostsPage } from "@/lib/types";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import { Loader2 } from "lucide-react";
import Post from "@/components/posts/Post";

const FollowingFeed = () => {
  const { user } = useSession();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", user.id],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/posts/following`,
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<PostsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
  const posts = data?.pages.flatMap((page) => page.posts) || [];
  if (status === "pending") return <PostsLoadingSkeleton />;
  if (status === "success" && !posts.length && !hasNextPage)
    return (
      <p className="text-center text-muted-foreground">
        Start following people to see their posts.....
      </p>
    );
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An Error Occured when Fetching the posts
      </p>
    );
  }
  return (
    <InfiniteScrollContainer
      classname="space-y-5"
      onButtomReached={() => {
        hasNextPage && !isFetching && fetchNextPage();
      }}
    >
      {posts?.map((post) => <Post key={post.id} post={post} />)}
      {isFetchingNextPage && (
        <Loader2 className="w-full animate-spin text-center" />
      )}
    </InfiniteScrollContainer>
  );
};

export default FollowingFeed;
