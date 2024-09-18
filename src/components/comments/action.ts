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
  if (!user) throw Error("Unauthorized");

  const { content: contentValidated } = createCommentSchema.parse({ content });

  const [newComment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content: contentValidated,
        postId: post.id,
        userId: user.id,
      },
      include: getCommentDataInclude(user.id),
    }),
    ...(post.user.id !== user.id
      ? [
          prisma.notification.create({
            data: {
              issuerId: user.id,
              type: "COMMENT",
              postId: post.id,
              recipientId: post.user.id,
            },
          }),
        ]
      : []),
  ]);

  return newComment;
};

export const deleteComment = async (commentId: string) => {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");

  const comment = await prisma.comment.findUnique({
    where: { id: commentId },
  });

  if (!comment) throw new Error("Comment not found");
  if (comment.userId !== user.id) throw new Error("Unauthorized");
  if (!comment || comment.userId !== user.id) {
    throw Error("Unauthorized");
  }

  const deletedComment = await prisma.comment.delete({
    where: { id: commentId },
    include: getCommentDataInclude(user.id),
  });
  return deletedComment;
};
