import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

/**
 * Returns the authenticated user's id, or null if not signed in.
 * Used by every API route to scope data to the current user.
 */
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getServerSession(authOptions);
  const id = (session?.user as { id?: string } | undefined)?.id;
  return id ?? null;
}
