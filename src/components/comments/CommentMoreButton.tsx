import { CommentData } from "@/lib/types";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { MoreHorizontal, Trash2 } from "lucide-react";
import DeletePostDialog from "../posts/DeletePostDialog";
import { Button } from "../ui/button";
import DeleteCommentDialog from "./DeleteCommentDialog";
import { useState } from "react";

interface CommentMoreButtonProps {
  comment: CommentData;
  className?: string;
}

const CommentMoreButton = ({ comment, className }: CommentMoreButtonProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size={"icon"} variant={"ghost"} className={className}>
            <MoreHorizontal className="size-5 text-muted-foreground" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="hover:bg-muted">
          <DropdownMenuItem onClick={() => setShowDeleteDialog(true)}>
            <span className="flex items-center gap-3 text-destructive">
              <Trash2 className="" />
              Delete
            </span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteCommentDialog
        comment={comment}
        open={showDeleteDialog}
        onClose={() => {
          setShowDeleteDialog(false);
        }}
      />
    </>
  );
};

export default CommentMoreButton;
