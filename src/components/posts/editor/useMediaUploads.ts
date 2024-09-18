import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadThing";
import { useState } from "react";

export interface Attachment {
  file: File;
  mediaId?: string;
  isUploading: boolean;
}
const useMediaUploads = () => {
  const { toast } = useToast();

  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [uploadingProgress, setUploadingProgress] = useState<number>();

  const { isUploading, startUpload } = useUploadThing("attachments", {
    onBeforeUploadBegin(files) {
      const renamedFiles = files.map((file) => {
        const extension = file.name.split(".").pop();
        return new File(
          [file],
          `attachment_${crypto.randomUUID()}.${extension}`,
          { type: file.type },
        );
      });
      setAttachments((prev) => [
        ...prev,
        ...renamedFiles.map((file) => ({ file, isUploading: true })),
      ]);

      return renamedFiles;
    },
    onUploadProgress: setUploadingProgress,
    onClientUploadComplete(res) {
      setAttachments((prev) =>
        prev.map((a) => {
          const uploadResult = res.find((r) => r.name === a.file.name);
          if (!uploadResult) return a;
          return {
            ...a,
            mediaId: uploadResult.serverData.mediaId,
            isUploading: false,
          };
        }),
      );
    },
    onUploadError(e) {
      setAttachments((prev) => prev.filter((a) => !a.isUploading));
      toast({
        description: e.message,
        variant: "destructive",
      });
    },
  });

  function handleStartUploads(files: File[]) {
    if (isUploading) {
      toast({
        variant: "destructive",
        description: "Please wait until the first upload is finished",
      });
      return;
    }
    if (attachments.length + files.length > 5) {
      toast({
        variant: "destructive",
        description: "Only 5 attachments are allowed in a post",
      });
      return;
    }
    startUpload(files);
  }

  function removeAttchment(fileName: string) {
    setAttachments((prev) => prev.filter((a) => a.file.name !== fileName));
  }

  function reset() {
    setAttachments([]);
    setUploadingProgress(undefined);
  }
  return {
    startUpload: handleStartUploads,
    isUploading,
    uploadingProgress,
    removeAttchment,
    reset,
    attachments,
  };
};

export default useMediaUploads;
