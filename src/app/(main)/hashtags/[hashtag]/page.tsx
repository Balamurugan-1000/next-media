import TrendsSidebar from "@/components/TrendsSidebar";
import { Metadata } from "next";
import HashtahResult from "./HashtagResult";

interface PageProps {
  params: { hashtag: string }; // Update the type to match the dynamic route
}

// Function to generate the page metadata dynamically
export function generateMetadata({ params: { hashtag } }: PageProps): Metadata {
  return {
    title: `Search results for "${hashtag}"`,
  };
}

// Main Page component
export default function Page({ params: { hashtag } }: PageProps) {
  return (
    <main className="flex w-full min-w-0 gap-5">
      <div className="w-full min-w-0 space-y-5">
        <div className="rounded-2xl bg-card p-5 shadow-sm">
          <h1 className="line-clamp-2 break-all text-center text-2xl font-bold">
            Posts with #{hashtag}
          </h1>
        </div>
        <HashtahResult
          params={{
            hashtag, // Passing the hashtag to the HashtahResult component
          }}
        />
      </div>
      <TrendsSidebar />
    </main>
  );
}
