import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { get } from "http";

export const GET = async (req: Request) => {
  try {
    const { user: loggedInUser } = await validateRequest();

    if (!loggedInUser) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const followersData = await prisma.follow.findMany({
      where: {
        followingId: loggedInUser.id,
      },
      select: {
        follower: {
          select: getUserDataSelect(loggedInUser.id),
        },
      },
    });

    let followersUsers = followersData.map((follow) => follow.follower);
    const followersCount = followersUsers.length - 1;
    followersUsers = followersUsers.filter(
      (user) => user.id !== loggedInUser.id,
    );
    console.log(followersUsers);

    return Response.json({ followersCount, followersUsers });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
};
