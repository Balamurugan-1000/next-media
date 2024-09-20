import { validateRequest } from "@/auth";
import prisma from "@/lib/prisma";
import { getUserDataSelect } from "@/lib/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  try {
    // Validate the request and retrieve the current user
    const { user } = await validateRequest();

    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const url = new URL(req.url);
    const searchTerm = url.searchParams.get("search") || ""; // Get the search term

    // Build the base query
    let queryConditions: any = {
      id: {
        not: user.id, // Exclude the current user from the suggestions
      },
    };

    // If a search term is provided, search by username or display name, else return non-followed users
    if (searchTerm) {
      queryConditions.OR = [
        {
          username: {
            contains: searchTerm,
            mode: "insensitive", // Case-insensitive search
          },
        },
        {
          displayName: {
            contains: searchTerm,
            mode: "insensitive", // Case-insensitive search
          },
        },
      ];
    } else {
      // If no search term is provided, exclude followed users
      queryConditions.NOT = {
        followers: {
          some: {
            followerId: user.id, // Exclude users that are already followed by the current user
          },
        },
      };
    }

    // Fetch users based on the conditions
    const followSuggestions = await prisma.user.findMany({
      where: queryConditions,
      select: getUserDataSelect(user.id), // Select user data
    });

    // Shuffle the results and return only the top 5 suggestions
    const followSuggestionsShuffled = followSuggestions
      .sort(() => 0.5 - Math.random())
      .slice(0, 5);

    return new Response(JSON.stringify(followSuggestionsShuffled), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
    });
  }
}
