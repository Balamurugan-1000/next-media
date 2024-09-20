"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getPostDataInclude } from "@/lib/types";
import { createPostSchema } from "@/lib/Validation";

export const submitPost = async (input: {
  content: string;
  mediaIds: string[];
}) => {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");
  const { content, mediaIds } = createPostSchema.parse(input);
  let usernames = extractUsernames(content);
  let userIds = await prisma.user.findMany({
    where: {
      username: {
        in: usernames,
      },
    },
  });

  const newPost = await prisma.$transaction(async (prisma) => {
    const post = await prisma.post.create({
      data: {
        content,
        userId: user.id,
        attachments: {
          connect: mediaIds.map((id) => ({ id })),
        },
      },
      include: getPostDataInclude(user.id),
    });

    {
      userIds.length > 0 &&
        (await Promise.all(
          userIds.map(async (recipientId) => {
            return await prisma.notification.create({
              data: {
                type: "MENTION",
                issuerId: user.id,
                recipientId: recipientId.id,
                postId: post.id,
              },
            });
          }),
        ));
    }

    return post; // Return the newly created post
  });

  // newPost will contain the created post object

  return newPost;
};
function extractUsernames(content: string) {
  const regex = /@(\w+)/g; // Matches usernames that start with '@' followed by word characters
  const usernames = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    usernames.push(match[1]); // Push the username without '@'
  }

  return usernames;
}
