"use client";
import InfiniteScrollContainer from "@/components/InfiniteScrollContainer";
import Post from "@/components/posts/Post";
import PostsLoadingSkeleton from "@/components/posts/PostsLoadingSkeleton";
import kyInstance from "@/lib/ky";
import { NotificationsPage, PostsPage } from "@/lib/types";
import {
  QueryClient,
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React, { useEffect } from "react";
import Notification from "./Notification";

const Bookmarks = () => {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    status,
  } = useInfiniteQuery({
    queryKey: ["notifications"],
    queryFn: ({ pageParam }) =>
      kyInstance
        .get(
          "/api/notifications",
          pageParam ? { searchParams: { cursor: pageParam } } : {},
        )
        .json<NotificationsPage>(),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });

  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: () => kyInstance.patch(`/api/notifications/mark-as-read`),
    onSuccess: () => {
      queryClient.setQueryData(["unread-notification-count"], {
        unreadCount: 0,
      });
    },
    onError(error) {
      console.error(error);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  const notifications = data?.pages.flatMap((page) => page.notifications) || [];
  if (status === "pending") return <PostsLoadingSkeleton />;
  if (status === "success" && !notifications.length && !hasNextPage)
    return (
      <p className="text-center text-muted-foreground">
        You don&apos;t have any notifications
      </p>
    );
  if (status === "error") {
    return (
      <p className="text-center text-destructive">
        An Error Occured while loading notifications
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
      {notifications?.map((notification) => (
        <Notification notification={notification} key={notification.id} />
      ))}
      {isFetchingNextPage && (
        <Loader2 className="w-full animate-spin text-center" />
      )}
    </InfiniteScrollContainer>
  );
};
export default Bookmarks;
