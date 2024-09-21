import { Prisma } from "@prisma/client";
import { ReactNode } from "react";

export const getUserDataSelect = (loggedInUserId: string) => {
  return {
    username: true,
    displayName: true,
    avatarUrl: true,
    id: true,
    bio: true,
    createdAt: true,

    followers: {
      where: {
        followerId: loggedInUserId,
      },
      select: {
        followerId: true,
      },
    },
    _count: {
      select: {
        followers: true,
        posts: true,
      },
    },
  } satisfies Prisma.UserSelect;
};

export const getPostDataInclude = (loggedInUserId: string) => {
  return {
    user: {
      select: getUserDataSelect(loggedInUserId),
    },
    attachments: true,
    likes: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },

    _count: {
      select: {
        likes: true,
        comments: true,
      },
    },
    bookmarks: {
      where: {
        userId: loggedInUserId,
      },
      select: {
        userId: true,
      },
    },
  } satisfies Prisma.PostInclude;
};

export type PostData = Prisma.PostGetPayload<{
  include: ReturnType<typeof getPostDataInclude>;
}>;

export interface PostsPage {
  posts: PostData[];
  nextCursor: string | null;
}

export interface FollowerInfo {
  userId: string;
  followers: number;
  isFollowedByUser: boolean;
  followersUsers: UserData[];
}

export interface FollowingInfo {
  followingCount: number;
  followingUsers: UserData[];
}
export interface FollowingInfo {
  followersCount: number;
  followers: UserData[];
}
export type UserData = Prisma.UserGetPayload<{
  select: ReturnType<typeof getUserDataSelect>;
}>;
export interface LikeInfo {
  likes: number;
  isLikedByUser: boolean;
}

export interface BookmarkInfo {
  isBookmarkedByUser: boolean;
}

export const getCommentDataInclude = (loggedInUserId: string) => {
  return {
    user: { select: getUserDataSelect(loggedInUserId) },
  } satisfies Prisma.CommentInclude;
};

export type CommentData = Prisma.CommentGetPayload<{
  include: ReturnType<typeof getCommentDataInclude>;
}>;

export interface CommentPage {
  comments: CommentData[];
  previousCursor: string | null;
}

export const notificationsInclude = {
  issuer: {
    select: {
      username: true,
      displayName: true,
      avatarUrl: true,
    },
  },
  post: {
    select: {
      content: true,
    },
  },
} satisfies Prisma.NotificationInclude;

export type NotificationData = Prisma.NotificationGetPayload<{
  include: typeof notificationsInclude;
}>;

export interface NotificationsPage {
  notifications: NotificationData[];
  nextCursor: string | null;
}

export interface NotificationCountInfo {
  unreadCount: number;
}
export interface MessageCountInfo {
  unreadCount: number;
}
export interface FollowSuggestion {
  _count: any;
  followers: any;
  username: ReactNode;
  id: string;
  name: string;
  profileImageUrl?: string; // Optional field if you have profile images
}

export interface FollowSuggestionsPage {
  suggestions: FollowSuggestion[];
  nextCursor: string | null; // Used for pagination
}
// types.ts (or wherever your types are defined)
export interface FollowSuggestionsProps {
  refetchSuggestions(): unknown;
  refetch: boolean;
}
