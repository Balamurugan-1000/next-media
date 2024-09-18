import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { CommentPage, getCommentDataInclude } from "@/lib/types";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params: { postId } }: { params: { postId: string } },
) => {
  try {
    const cursor = req.nextUrl.searchParams.get("cursor") || undefined;

    const pageSize = 5;
    const { user } = await validateRequest();
    if (!user) return Response.json({ error: "unauthorized" }, { status: 401 });

    const comment = await prisma.comment.findMany({
      where: { postId },
      include: getCommentDataInclude(user.id),
      orderBy: { createdAt: "asc" },
      take: -pageSize - 1,
      cursor: cursor ? { id: cursor } : undefined,
    });
    const previousCursor = comment.length > pageSize ? comment[0].id : null;

    const data: CommentPage = {
      comments: comment.length > 1 ? comment.slice(1) : comment,
      previousCursor,
    };
    return Response.json(data);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
