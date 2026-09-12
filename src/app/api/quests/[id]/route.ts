import { NextRequest } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { ok, bad, unauthorized, serverError } from "@/lib/api";
import {
  CATEGORIES,
  DIFFICULTIES,
  DIFFICULTY_REWARDS,
  type Difficulty,
} from "@/lib/progression";

const updateSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  description: z.string().trim().max(500).nullable().optional(),
  category: z.enum(CATEGORIES).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
});

export const dynamic = "force-dynamic";

// UPDATE quest metadata (only if it belongs to the user and isn't completed)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const existing = await prisma.quest.findUnique({
      where: { id: params.id },
    });
    if (!existing || existing.userId !== userId) {
      return bad("Quest not found", 404);
    }

    const body = await req.json().catch(() => null);
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) {
      return bad(parsed.error.issues[0]?.message ?? "Invalid update");
    }

    const data: Record<string, unknown> = { ...parsed.data };
    // Recompute rewards if difficulty changed.
    if (parsed.data.difficulty) {
      const rewards = DIFFICULTY_REWARDS[parsed.data.difficulty as Difficulty];
      data.xpReward = rewards.xp;
      data.goldReward = rewards.gold;
    }

    const quest = await prisma.quest.update({
      where: { id: params.id },
      data,
    });
    return ok(quest);
  } catch (err) {
    console.error("quest PATCH error", err);
    return serverError();
  }
}

// DELETE a quest
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const existing = await prisma.quest.findUnique({
      where: { id: params.id },
    });
    if (!existing || existing.userId !== userId) {
      return bad("Quest not found", 404);
    }

    await prisma.quest.delete({ where: { id: params.id } });
    return ok({ deleted: true, id: params.id });
  } catch (err) {
    console.error("quest DELETE error", err);
    return serverError();
  }
}
