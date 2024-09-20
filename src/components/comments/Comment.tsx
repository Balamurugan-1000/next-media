import { CommentData } from "@/lib/types";
import UserTooltip from "../UserTooltip";
import Link from "next/link";
import UserAvatar from "../UserAvatar";
import { formatRelativeDate } from "@/lib/utils";
import { useSession } from "@/app/(main)/SessionProvider";
import CommentMoreButton from "./CommentMoreButton";
import Linkify from "../Linkify";

interface CommentProps {
  comment: CommentData;
}

const Comment = ({ comment }: CommentProps) => {
  const { user } = useSession();
  return (
    <div className="group/comment flex justify-start gap-5 py-3">
      <span className="hidden sm:inline">
        <UserTooltip user={comment.user}>
          <Link href={`/users/${comment.user.username}`}>
            <UserAvatar avatarurl={comment.user.avatarUrl} size={40} />
          </Link>
        </UserTooltip>
      </span>
      <div className="">
        <div className="flex flex-nowrap items-center gap-2 text-sm">
          <UserTooltip user={comment.user}>
            <Link href={`/users/${comment.user.username}`}>
              <span className="font-medium hover:underline">
                {comment.user.displayName}{" "}
              </span>
            </Link>
          </UserTooltip>
          <div className="text-muted-foreground">
            {formatRelativeDate(comment.createdAt)}
          </div>
        </div>
        <Linkify>
          <div className="">{comment.content}</div>
        </Linkify>
      </div>
      {comment.user.id === user?.id && (
        <CommentMoreButton
          comment={comment}
          className="ms-auto opacity-0 transition-opacity group-hover/comment:opacity-100"
        />
      )}
    </div>
  );
};

export default Comment;
