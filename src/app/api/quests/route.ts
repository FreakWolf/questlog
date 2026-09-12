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

const createSchema = z.object({
  title: z.string().trim().min(1, "Quest title is required").max(120),
  description: z.string().trim().max(500).optional().or(z.literal("")),
  category: z.enum(CATEGORIES),
  difficulty: z.enum(DIFFICULTIES),
});

export const dynamic = "force-dynamic";

// LIST the current user's quests
export async function GET() {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();
    const quests = await prisma.quest.findMany({
      where: { userId },
      orderBy: [{ completed: "asc" }, { createdAt: "desc" }],
    });
    return ok(quests);
  } catch (err) {
    console.error("quests GET error", err);
    return serverError();
  }
}

// CREATE a quest
export async function POST(req: NextRequest) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const body = await req.json().catch(() => null);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return bad(parsed.error.issues[0]?.message ?? "Invalid quest");
    }
    const { title, description, category, difficulty } = parsed.data;
    const rewards = DIFFICULTY_REWARDS[difficulty as Difficulty];

    const quest = await prisma.quest.create({
      data: {
        userId,
        title,
        description: description || null,
        category,
        difficulty,
        xpReward: rewards.xp,
        goldReward: rewards.gold,
      },
    });

    return ok(quest, 201);
  } catch (err) {
    console.error("quests POST error", err);
    return serverError();
  }
}
