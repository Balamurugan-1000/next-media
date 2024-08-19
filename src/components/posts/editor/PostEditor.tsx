"use client";
import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { submitPost } from "./action";
import UserAvatar from "@/components/UserAvatar";
import { useSession } from "@/app/(main)/SessionProvider";
import { Button } from "@/components/ui/button";
import "./styles.css";
const PostEditor = () => {
  const { user } = useSession();
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
    console.log("Hi");
    await submitPost(input);
    editor?.commands.clearContent();
  };
  return (
    <div className="flex flex-col gap-5 rounded-2xl bg-card p-5 shadow-sm">
      <div className="flex gap-5">
        <UserAvatar avatarurl={user.avatarUrl} classname="hidden sm:inline" />
        <EditorContent
          editor={editor}
          className="styled-scrollbar max-h-[20rem] w-full overflow-y-auto rounded-2xl bg-background px-5 py-3"
        />
      </div>
      <div className="flex justify-end">
        <Button
          onClick={onSubmitHandler}
          disabled={!input}
          className="min-w-20"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default PostEditor;
