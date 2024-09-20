import FollowingUsers from "@/components/FollowingUsers";
import useFollowingInfo from "@/hooks/useFollowingInfo";
import React from "react";

const page = () => {
  return (
    <div className="mt-0 flex min-h-screen w-full max-w-xl items-start justify-center gap-5 bg-background lg:max-w-[1100px]">
      <div className="mt-[-10] flex w-3/4 flex-col rounded-lg border border-card-foreground bg-background p-6 shadow-md">
        <h1 className="mb-4 text-2xl font-bold">Following Users</h1>
        <div className="flex-grow">
          <FollowingUsers />
        </div>
      </div>
    </div>
  );
};

export default page;
