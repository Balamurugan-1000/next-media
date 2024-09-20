import { validateRequest } from "@/auth";

export async function extractUsernames(content: string) {
  const { user } = await validateRequest();
}
