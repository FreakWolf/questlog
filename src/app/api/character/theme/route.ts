import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { ok, bad, unauthorized, serverError } from "@/lib/api";

const schema = z.object({ theme: z.string().min(1) });

export const dynamic = "force-dynamic";

/** Equip a theme the user owns. */
export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return bad("Invalid request");

    // Verify the user owns a theme item with this payload.
    const owned = await prisma.inventoryItem.findFirst({
      where: {
        userId,
        shopItem: { type: "theme", payload: parsed.data.theme },
      },
    });
    if (!owned) return bad("You don't own that theme", 403);

    const character = await prisma.character.update({
      where: { userId },
      data: { equippedTheme: parsed.data.theme },
    });
    return ok({ character });
  } catch (err) {
    console.error("theme error", err);
    return serverError();
  }
}
