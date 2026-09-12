import { prisma } from "@/lib/prisma";

/**
 * Ensures the user has a Character row (defensive — should exist from signup)
 * and returns it.
 */
export async function ensureCharacter(userId: string) {
  const existing = await prisma.character.findUnique({ where: { userId } });
  if (existing) return existing;
  return prisma.character.create({ data: { userId } });
}

/** Full player state used to hydrate the dashboard. */
export async function getPlayerState(userId: string) {
  const [user, character, quests, inventory, logs, shopItems] =
    await Promise.all([
      prisma.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true, email: true, createdAt: true },
      }),
      ensureCharacter(userId),
      prisma.quest.findMany({
        where: { userId },
        orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
      }),
      prisma.inventoryItem.findMany({
        where: { userId },
        include: { shopItem: true },
        orderBy: { acquiredAt: "desc" },
      }),
      prisma.activityLog.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 25,
      }),
      prisma.shopItem.findMany({ orderBy: { cost: "asc" } }),
    ]);

  const ownedSlugs = new Set(inventory.map((i) => i.shopItem.slug));

  return {
    user,
    character,
    quests,
    inventory: inventory.map((i) => ({
      id: i.id,
      acquiredAt: i.acquiredAt,
      item: i.shopItem,
    })),
    logs,
    shop: shopItems.map((s) => ({ ...s, owned: ownedSlugs.has(s.slug) })),
  };
}

export type PlayerState = Awaited<ReturnType<typeof getPlayerState>>;
