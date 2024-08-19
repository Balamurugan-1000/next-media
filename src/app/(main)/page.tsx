import PostEditor from "@/components/posts/editor/PostEditor";
import prisma from "@/lib/prisma";
import React from "react";

const NewPage = async () => {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          username: true,
          displayName: true,
          avatarUrl: true,
        },
      },
    },
  });
  return (
    <div id="Ok" className="h-[200vh] w-full bg-blue-100">
      <div className="w-full">
        <PostEditor />
      </div>
    </div>
  );
};

export default NewPage;
