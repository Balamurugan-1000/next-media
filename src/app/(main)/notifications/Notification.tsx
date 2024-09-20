import UserAvatar from "@/components/UserAvatar";
import { NotificationData } from "@/lib/types";
import { cn } from "@/lib/utils";
import { NotificationType } from "@prisma/client";
import { AtSign, AtSignIcon, Heart, MessageCircle, User2 } from "lucide-react";
import Link from "next/link";

interface NotificationProps {
  notification: NotificationData;
}

const Notification = ({ notification }: NotificationProps) => {
  const notificationTypeMap: Record<
    NotificationType,
    { message: string; icon: JSX.Element; href: string }
  > = {
    FOLLOW: {
      message: `${notification.issuer.displayName} followed you`,
      icon: <User2 className="size-7 text-primary" />,
      href: `/users/${notification.issuer.username}`,
    },
    COMMENT: {
      message: `${notification.issuer.displayName} commented on your post`,
      icon: <MessageCircle className="size-7 text-primary" />,
      href: `/posts/${notification.postId}`,
    },
    LIKE: {
      message: `${notification.issuer.displayName} COMMENTd your post`,
      icon: <Heart className="size-7 fill-red-500 text-red-500" />,
      href: `/posts/${notification.postId}`,
    },
    MENTION: {
      message: `${notification.issuer.displayName} mentioned  you in a  post`,
      icon: <AtSign className="size-7" />,
      href: `/posts/${notification.postId}`,
    },

    MENTION_IN_COMMENTS: {
      message: `${notification.issuer.displayName} mentioned  you in a  comment`,
      icon: <AtSignIcon className="size-7" />,
      href: `/posts/${notification.postId}`,
    },
  };

  const { href, icon, message } = notificationTypeMap[notification.type];

  return (
    <Link href={href} className="block">
      <article
        className={cn(
          "flex gap-5 rounded-2xl bg-card p-5 shadow-sm transition-colors hover:bg-card/70",
          !notification.read && "bg-primary/10",
        )}
      >
        <div className="my-1">{icon}</div>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-5">
            <UserAvatar avatarurl={notification.issuer.avatarUrl} size={36} />
            <div className="inline-block">
              <span className="font-bold">
                {notification.issuer.displayName}
              </span>{" "}
              <span>{message}</span>
            </div>
          </div>
          {notification.post && (
            <div className="line-clamp-3 whitespace-pre-line text-muted-foreground">
              {notification.post.content}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default Notification;
