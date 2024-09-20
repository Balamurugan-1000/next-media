"use client";

import { PostData } from "@/lib/types";
import Link from "next/link";
interface PostProps {
  post: PostData;
}
import React, { useState } from "react";
import UserAvatar from "../UserAvatar";
import { cn, formatRelativeDate } from "@/lib/utils";
import { validateRequest } from "@/auth";
import { useSession } from "@/app/(main)/SessionProvider";
import PostMoreButton from "./PostMoreButton";
import Linkify from "../Linkify";
import UserTooltip from "../UserTooltip";
import { Media } from "@prisma/client";
import Image from "next/image";
import LikeButton from "./LikeButton";
import BookmarkButton from "./BookmarkButton";
import { MessageSquare } from "lucide-react";
import Comments from "../comments/Comments";

const Post = ({ post }: PostProps) => {
  const { user } = useSession();

  const [showComments, setShowComments] = useState(false);
  return (
    <article className="group/post space-y-3 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <UserTooltip user={post.user}>
            <Link href={`/users/${post.user.username}`}>
              <UserAvatar avatarurl={post.user.avatarUrl} />
            </Link>
          </UserTooltip>
          <div className="">
            <UserTooltip user={post.user}>
              <Link
                href={`/users/${post.user.username}`}
                className="block font-medium hover:underline"
              >
                {post.user.displayName}
              </Link>
            </UserTooltip>

            <Link
              href={`/posts/${post.id}`}
              className="block text-sm text-muted-foreground hover:underline"
              suppressContentEditableWarning
            >
              {formatRelativeDate(post.createdAt)}
            </Link>
          </div>
        </div>
        {post.userId === user.id && (
          <PostMoreButton
            post={post}
            className="opacity-0 transition-opacity hover:bg-muted group-hover/post:opacity-100"
          />
        )}{" "}
      </div>
      <Linkify>
        <div className="whitespace-pre-line break-words">{post.content}</div>
      </Linkify>

      {!!post.attachments.length && (
        <MediaPreviews attachments={post.attachments} />
      )}

      <hr className="text-muted-foreground" />
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-5">
          <LikeButton
            postId={post.id}
            initialState={{
              isLikedByUser: post.likes.some((like) => like.userId === user.id),
              likes: post._count.likes,
            }}
          />
          <CommentButton
            post={post}
            onClick={() => setShowComments(!showComments)}
          />
        </div>
        <BookmarkButton
          initialState={{
            isBookmarkedByUser: post.bookmarks.some(
              (a) => a.userId === user.id,
            ),
          }}
          postId={post.id}
        />
      </div>
      {showComments && <Comments post={post} />}
    </article>
  );
};

export default Post;

function MediaPreviews({ attachments }: { attachments: Media[] }) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <MediaPreview media={attachment} key={attachment.id} />
      ))}
    </div>
  );
}

function MediaPreview({ media }: { media: Media }) {
  if (media.type === "IMAGE") {
    return (
      <Image
        src={media.url}
        alt="media"
        height={500}
        width={500}
        className="mx-auto size-fit max-h-[30rem] rounded-2xl"
      />
    );
  }
  if (media.type === "VIDEO") {
    return (
      <div className="">
        <video
          src={media.url}
          controls
          className="mx-auto size-fit max-h-[30rem] rounded-2xl"
        />
      </div>
    );
  }
  return <p className="text-destructive"> Not a supported file format</p>;
}

interface CommentButtonProps {
  post: PostData;
  onClick: () => void;
}

const CommentButton = ({ post, onClick }: CommentButtonProps) => {
  return (
    <button onClick={onClick} className="flex items-center gap-3">
      <MessageSquare size={20} />
      <span className="text-sm font-medium tabular-nums">
        {post._count.comments}
        <span className="hidden sm:inline"> Comments</span>
      </span>
    </button>
  );
};
