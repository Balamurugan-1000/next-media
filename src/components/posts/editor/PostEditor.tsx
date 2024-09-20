"use client";
import React, { ClipboardEvent, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { submitPost } from "./action";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import "./styles.css";
import { useSubmitPostMutation } from "./mutation";
import LoadingButton from "@/components/LoadingButton";
import useMediaUploads, { Attachment } from "./useMediaUploads";
import { ImageIcon, Loader2, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useDropzone } from "@uploadthing/react";
const PostEditor = () => {
  const { user } = useSession();
  const mutation = useSubmitPostMutation();
  const {
    removeAttchment,
    isUploading,
    attachments,
    reset: resetMediaUploads,
    startUpload,
    uploadingProgress,
  } = useMediaUploads();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: startUpload,
  });

  const { onClick, ...rootProps } = getRootProps();
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bold: false,
        italic: false,
      }),
      Placeholder.configure({
        placeholder: "Next Media is best",
      }),
    ],
    immediatelyRender: false,
  });

  const input =
    editor?.getText({
      blockSeparator: "\n",
    }) || "";

  const onSubmitHandler = async () => {
    mutation.mutate(
      {
        content: input,
        mediaIds: attachments.map((a) => a.mediaId).filter(Boolean) as string[],
      },
      {
        onSuccess: () => {
          editor?.commands.clearContent();
          resetMediaUploads();
        },
      },
    );
  };

  function onPaste(e: ClipboardEvent<HTMLInputElement>) {
    const files = Array.from(e.clipboardData.items)
      .filter((item) => item.kind === "file")
      .map((item) => item.getAsFile()) as File[];
    startUpload(files);
  }
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarurl={user.avatarUrl} className="hidden sm:inline" />
        <div {...rootProps} className="w-full">
          <EditorContent
            editor={editor}
            onPaste={onPaste}
            onSubmit={onSubmitHandler}
            className={cn(
              "styled-scrollbar max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3",
              isDragActive && "outline-dashed",
            )}
          />
          <input {...getInputProps()} onPaste={onPaste} />
        </div>
      </div>
      {!!attachments.length && (
        <AttachmentsPreview
          attachments={attachments}
          removeAttachment={removeAttchment}
        />
      )}
      <div className="flex items-center justify-end gap-3">
        {isUploading && (
          <>
            <span className="text-sm"> {uploadingProgress ?? 0} %</span>
            <Loader2 className="size-5 animate-spin text-primary" />
          </>
        )}
        <AttachmentsButton
          disabled={isUploading || attachments.length > 5}
          onFileSelected={startUpload}
        />
        <LoadingButton
          loading={mutation.isPending}
          onClick={onSubmitHandler}
          disabled={!input || isUploading}
          className="min-w-20"
        >
          Post
        </LoadingButton>
      </div>
    </div>
  );
};

export default PostEditor;

interface AttachmentsButtonProps {
  onFileSelected: (files: File[]) => void;
  disabled: boolean;
}
const AttachmentsButton = ({
  disabled,
  onFileSelected,
}: AttachmentsButtonProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  return (
    <>
      <Button
        variant={"ghost"}
        size={"icon"}
        className="text-primary"
        disabled={disabled}
        onClick={() => fileInputRef.current?.click()}
      >
        <ImageIcon size={20} />
      </Button>
      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        className="sr-only hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          if (files.length) {
            onFileSelected(files);
            e.target.value = "";
          }
        }}
      />
    </>
  );
};

interface AttachmentsPreviewsProps {
  attachments: Attachment[];
  removeAttachment: (filename: string) => void;
}

function AttachmentsPreview({
  attachments,
  removeAttachment,
}: AttachmentsPreviewsProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3",
        attachments.length > 1 && "sm:grid sm:grid-cols-2",
      )}
    >
      {attachments.map((attachment) => (
        <AttachmentPreview
          attachment={attachment}
          onRemoveClick={() => removeAttachment(attachment.file.name)}
          key={attachment.file.name}
        />
      ))}
    </div>
  );
}

interface AttachmentsPreviewProps {
  attachment: Attachment;
  onRemoveClick: () => void;
}

function AttachmentPreview({
  attachment: { file, isUploading, mediaId },
  onRemoveClick,
}: AttachmentsPreviewProps) {
  const src = URL.createObjectURL(file);

  return (
    <div
      className={cn("relative mx-auto size-fit", isUploading && "opacity-50")}
    >
      {file.type.startsWith("image") ? (
        <Image
          src={src}
          alt="Attachment preview"
          width={500}
          height={500}
          className="size-fit max-h-[30rem] rounded-2xl"
        />
      ) : (
        <video controls className="max-h-30rem size-fit rounded-2xl">
          <source src={src} type={file.type} />
        </video>
      )}

      {!isUploading && (
        <button
          onClick={onRemoveClick}
          className="absolute right-3 top-3 rounded-full bg-foreground p-1.5 text-background transition-colors hover:bg-foreground/60"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
