import { Button } from "@/components/ui/button";
import { Bell, Bookmark, Home, Mail, User, Users, UserX } from "lucide-react";
import Link from "next/link";
import NotificationsButton from "./NotificationsButton";
import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import MessagesButton from "./MessagesButton";
import streamServerClient from "@/lib/stream";
import FollowSuggestions from "./follow-suggestions/FollowSuggestions";

interface MenuBarProps {
  classname?: string;
}

const MenuBar = async ({ classname }: MenuBarProps) => {
  const { user } = await validateRequest();

  if (!user) return null;

  const [unreadNotificationsCount, unreadMessagesCount] = await Promise.all([
    prisma.notification.count({
      where: {
        recipientId: user.id,
        read: false,
      },
    }),
    (await streamServerClient.getUnreadCount(user.id)).total_unread_count,
  ]);
  return (
    <div className={classname}>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3 hover:text-primary"
        title="Home"
        asChild
      >
        <Link href={"/"}>
          <Home />
          <span className="hidden lg:inline">Home</span>
        </Link>
      </Button>
      <NotificationsButton
        initialState={{ unreadCount: unreadNotificationsCount }}
      />
      <MessagesButton initialState={{ unreadCount: unreadMessagesCount }} />
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3 hover:text-primary"
        title="Bookmarks"
        asChild
      >
        <Link href={"/bookmarks"} className="hover:text-primary">
          <Bookmark />
          <span className="hidden lg:inline">Bookmarks</span>
        </Link>
      </Button>
      <Button
        variant={"ghost"}
        className="flex items-center justify-start gap-3 hover:text-primary"
        title="Find people"
        asChild
      >
        <Link href={"/follow-suggestions"} className="hover:text-primary">
          <Users />
          <span className="hidden lg:inline">Find people</span>
        </Link>
      </Button>
    </div>
  );
};

export default MenuBar;
