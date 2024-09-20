import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";

export const GET = async () => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { total_unread_count } = await streamServerClient.getUnreadCount(
      user.id,
    );

    return Response.json({ unreadCount: total_unread_count });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Enternal server Error" }, { status: 500 });
  }
};
