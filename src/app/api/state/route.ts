import { getCurrentUserId } from "@/lib/session";
import { getPlayerState } from "@/lib/playerState";
import { ok, unauthorized, serverError } from "@/lib/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();
    const state = await getPlayerState(userId);
    return ok(state);
  } catch (err) {
    console.error("state error", err);
    return serverError("Could not load your adventure");
  }
}
