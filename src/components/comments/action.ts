"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getCommentDataInclude, PostData } from "@/lib/types";
import { createCommentSchema } from "@/lib/Validation";

export const submitComment = async ({
  post,
  content,
}: {
  post: PostData;
  content: string;
}) => {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const { content: contentValidated } = createCommentSchema.parse({ content });
  const usernames = extractUsernames(content);
  const users = await prisma.user.findMany({
    where: {
      username: {
        in: usernames,
      },
    },
  });

  const userIds = users.map((user) => user.id);

  const newComment = await prisma.$transaction(async (prisma) => {
    const comment = await prisma.comment.create({
      data: {
        content: contentValidated,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    });

    // Create notification for the post owner if the commenter is not the owner
    if (post.user.id !== user.id) {
      await prisma.notification.create({
        data: {
          issuerId: user.id,
          type: "COMMENT",
          postId: post.id,
          recipientId: post.user.id,
        },
      });
    }

    // Create mention notifications for mentioned users
    if (userIds.length > 0) {
      await Promise.all(
        userIds.map(async (recipientId) => {
          if (user.id != recipientId)
            return await prisma.notification.create({
              data: {
                type: "MENTION_IN_COMMENTS",
                issuerId: user.id,
                recipientId,
                postId: post.id,
              },
            });
        }),
      );
    }

    return comment;
  });

  return newComment;
};

export const deleteComment = async (commentId: string) => {
  const { user } = await validateRequest();
  if (!user) throw new Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  const usernames = extractUsernames(comment?.content as string);
  const users = await prisma.user.findMany({
    where: {
      username: {
        in: usernames,
      },
    },
  });
  const userIds = users.map((user) => user.id);

  if (!comment) throw new Error("Comment not found");
  if (comment.userId !== user.id) throw new Error("Unauthorized");

  const deletedComment = await prisma.comment.delete({
    where: { id: commentId },
    include: getCommentDataInclude(user.id),
  });
  if (userIds.length > 0) {
    await Promise.all(
      userIds.map(async (recipientId) => {
        return await prisma.notification.create({
          data: {
            type: "MENTION_IN_COMMENTS",
            issuerId: user.id,
            recipientId,
            postId: comment.postId,
          },
        });
      }),
    );
  }
  return deletedComment;
};

function extractUsernames(content: string) {
  const regex = /@(\w+)/g; // Matches usernames that start with '@' followed by word characters
  const usernames: string[] = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    usernames.push(match[1]); // Push the username without '@'
  }

  return usernames;
}
