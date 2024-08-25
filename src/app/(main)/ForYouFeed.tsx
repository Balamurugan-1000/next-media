"use client";
import Post from "@/components/posts/Post";
import { PostData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import React from "react";

const ForYouFeed = () => {
  const query = useQuery<PostData[]>({
    queryKey: ["post-feed", "for-you"],
    queryFn: async () => {
      const res = await fetch("/api/posts/for-you");
      if (!res.ok) {
        throw Error(`Request failed with code ${res.status} `);
      }
      return res.json();
    },
  });
  if (query.status === "pending")
    return <Loader2 className="mx-auto animate-spin" />;
  if (query.status === "error") {
    return (
      <p className="text-center text-destructive">
        An Error Occured when Fetching the posts
      </p>
    );
  }
  return (
    <>
      {query.data.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
};
export default ForYouFeed;
