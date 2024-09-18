import { useSession } from "@/app/(main)/SessionProvider";
import { useToast } from "../ui/use-toast";
import {
  InfiniteData,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { deleteComment, submitComment } from "./action";
import { CommentData, CommentPage } from "@/lib/types";

export const useSubmitCommentMutation = (postId: string) => {
  const { toast } = useToast();
  const { user } = useSession();

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: submitComment,
    onSuccess: async (newComment) => {
      const querykey: QueryKey = ["comments", postId];

      await queryClient.cancelQueries({ queryKey: querykey });
      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        querykey,
        (oldData) => {
          const firstPage = oldData?.pages[0];
          if (firstPage)
            return {
              pageParams: oldData.pageParams,
              pages: [
                {
                  comments: [...firstPage.comments, newComment],
                  previousCursor: firstPage.previousCursor,
                },
                ...oldData.pages.slice(1),
              ],
            };
        },
      );

      queryClient.invalidateQueries({
        queryKey: querykey,
        predicate: (query) => !query.state.data,
      });

      toast({
        description: "Comment created",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to add the comment . Please try again",
      });
    },
  });
  return mutation;
};

export const useDeleteCommentMutation = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: deleteComment,
    onSuccess: async (deletedComment) => {
      const queryKey: QueryKey = ["comments", deletedComment.postId];

      await queryClient.cancelQueries({ queryKey: queryKey });

      queryClient.setQueryData<InfiniteData<CommentPage, string | null>>(
        queryKey,
        (oldData) => {
          if (!oldData) return;
          return {
            pageParams: oldData.pageParams,
            pages: oldData.pages.map((page) => ({
              comments: page.comments.filter(
                (comment) => comment.id !== deletedComment.id,
              ),
              previousCursor: page.previousCursor,
            })),
          };
        },
      );
      toast({
        description: "Comment deleted",
      });
    },
    onError: (error) => {
      console.log(error);
      toast({
        variant: "destructive",
        description: "Failed to delete the comment. Please try again",
      });
    },
  });
  return mutation;
};
