import Followers from "@/components/FollowersList";
import React from "react";

const page = () => {
  return (
    <div className="mt-0 flex min-h-screen w-full items-start justify-center gap-5 bg-background px-4 lg:px-0">
      <div className="flex flex-col rounded-lg border border-card-foreground bg-background p-5 shadow-md lg:w-3/4 lg:p-6">
        <h1 className="mb-4 text-center text-xl font-bold lg:text-2xl">
          Following Users
        </h1>
        <div className="flex-grow">
          <Followers />
        </div>
      </div>
    </div>
  );
};

export default page;
