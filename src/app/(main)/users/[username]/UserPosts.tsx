"use client";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { PostsPage } from "@/lib/types";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

interface UserPostsProps {
  userId: string;
}
const UserPosts = ({ userId }: UserPostsProps) => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["post-feed", userId],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          `/api/users/${userId}/posts`,
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
        this user has&apos;t posted anything yet...
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
export default UserPosts;
