import { validateRequest } from "@/auth";
import streamServerClient from "@/lib/stream";

export const GET = async () => {
  try {
    const { user } = await validateRequest();

    if (!user) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query the channels where the user has unread messages
    const channels = await streamServerClient.queryChannels({
      members: { $in: [user.id] }, // Filter to channels where the user is a member
      has_unread: true, // Filter for channels that have unread messages
    });

    const totalUnreadChannels = channels.length; // Total number of channels with unread messages

    return Response.json({ unreadChannels: totalUnreadChannels });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
};
