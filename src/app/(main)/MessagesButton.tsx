"use client";

import { Button } from "@/components/ui/button";
import kyInstance from "@/lib/ky";
import { MessageCountInfo } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Bell, Mailbox, MailIcon } from "lucide-react";
import Link from "next/link";

interface MessageButtonProps {
  initialState: MessageCountInfo;
}

const MessagesButton = ({ initialState }: MessageButtonProps) => {
  const { data } = useQuery({
    queryKey: ["unread-message-count"],
    queryFn: () =>
      kyInstance.get(`/api/messages/unread-count`).json<MessageCountInfo>(),
    initialData: initialState,
    refetchInterval: 10 * 1000,
  });
  return (
    <Button
      variant={"ghost"}
      className="flex items-center justify-start gap-3 hover:text-primary"
      title="Messages"
      asChild
    >
      <Link href={"/messages"}>
        <div className="relative">
          <MailIcon />
          {!!data.unreadCount && (
            <span className="absolute -right-1 -top-1 rounded-full bg-primary px-1 text-xs font-medium tabular-nums text-primary-foreground">
              {data.unreadCount}
            </span>
          )}
        </div>
        <span className="hidden lg:inline">Messages</span>
      </Link>
    </Button>
  );
};

export default MessagesButton;
