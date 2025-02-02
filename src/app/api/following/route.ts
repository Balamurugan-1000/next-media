import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export const GET = async (req: Request) => {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const followingData = await prisma.follow.findMany({
      where: { followerId: loggedInUser.id },
      select: {
        following: {
          select: getUserDataSelect(loggedInUser.id),
        },
      },
    });

    let followingUsers = followingData.map((follow) => follow.following);
    followingUsers = followingUsers.filter(
      (user) => user.id !== loggedInUser.id,
    );
    const followingCount = followingUsers.length;

    return Response.json({ followingCount, followingUsers });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
