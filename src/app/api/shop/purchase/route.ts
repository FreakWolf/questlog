import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { ok, bad, unauthorized, serverError } from "@/lib/api";

const schema = z.object({ slug: z.string().min(1) });

export const dynamic = "force-dynamic";

/**
 * Purchase a shop item. Server-authoritative: checks gold balance, prevents
 * double-buys, deducts cost and grants the item in one transaction.
 */
export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const body = await req.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) return bad("Invalid request");

    const result = await prisma.$transaction(async (tx) => {
      const item = await tx.shopItem.findUnique({
        where: { slug: parsed.data.slug },
      });
      if (!item) return { error: "Item not found" as const };

      const character = await tx.character.findUnique({ where: { userId } });
      if (!character) return { error: "Character missing" as const };

      const alreadyOwned = await tx.inventoryItem.findUnique({
        where: { userId_shopItemId: { userId, shopItemId: item.id } },
      });
      if (alreadyOwned) return { error: "You already own this" as const };

      if (character.gold < item.cost) {
        return { error: "Not enough gold" as const };
      }

      const updatedCharacter = await tx.character.update({
        where: { userId },
        data: { gold: { decrement: item.cost } },
      });

      await tx.inventoryItem.create({
        data: { userId, shopItemId: item.id },
      });

      await tx.activityLog.create({
        data: {
          userId,
          type: "purchase",
          message: `Purchased ${item.name} for ${item.cost} gold`,
          goldDelta: -item.cost,
        },
      });

      return { character: updatedCharacter, item };
    });

    if ("error" in result && result.error) {
      const status = result.error === "Item not found" ? 404 : 400;
      return bad(result.error, status);
    }
    return ok(result);
  } catch (err) {
    console.error("purchase error", err);
    return serverError("Could not complete purchase");
  }
}
