"use server";

import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { createPostSchema } from "@/lib/Validation";

export const submitPost = async (input: string) => {
  const { user } = await validateRequest();
  if (!user) throw Error("Unauthorized");
  const { content } = createPostSchema.parse({ content: input });
  const newPost = await prisma.post.create({
    data: {
      content,
      userId: user.id,
    },
  });
  console.log(newPost);
};
