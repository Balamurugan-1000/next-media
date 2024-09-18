import { CommentData } from "@/lib/types";
import { useDeleteCommentMutation } from "./mutation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import LoadingButton from "../LoadingButton";
import { Button } from "../ui/button";

interface DeleteCommentDialogProps {
  comment: CommentData;
  open: boolean;
  onClose: () => void;
}

const DeleteCommentDialog = ({
  onClose,
  open,
  comment,
}: DeleteCommentDialogProps) => {
  const mutation = useDeleteCommentMutation();
  const handleOpenChange = (open: boolean) => {
    if (open || !mutation.isPending) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Comment ?</DialogTitle>
          <DialogDescription>
            Are you sure want to delete this Comment ? . This cannot be undone
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <LoadingButton
            variant={"destructive"}
            onClick={() => mutation.mutate(comment.id, { onSuccess: onClose })}
            loading={mutation.isPending}
          >
            Delete
          </LoadingButton>
          <Button
            variant={"outline"}
            onClick={onClose}
            disabled={mutation.isPending}
            className="hover:bg-transparent hover:text-black"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteCommentDialog;
