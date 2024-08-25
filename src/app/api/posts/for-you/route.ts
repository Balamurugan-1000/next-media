import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { postDataInclude } from "@/lib/types";

export const GET = async () => {
  try {
    const { user } = await validateRequest();

    if (!user) return Response.json({ Error: "Unauthorized" }, { status: 401 });

    const posts = await prisma.post.findMany({
      include: postDataInclude,
      orderBy: { createdAt: "desc" },
    });
    return Response.json(posts);
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Enternal server Error" }, { status: 500 });
  }
};
