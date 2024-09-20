import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";

export const GET = async (req: Request) => {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch following data with full user information
    const followingData = await prisma.follow.findMany({
      where: { followerId: loggedInUser.id },
      select: {
        following: {
          select: getUserDataSelect(loggedInUser.id), // Fetch full user data for each following user
        },
      },
    });

    const followingUsers = followingData.map((follow) => follow.following);
    const followingCount = followingUsers.length;

    console.log(followingUsers);
    return Response.json({ followingCount, followingUsers });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
