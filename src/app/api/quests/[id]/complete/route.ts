import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUserId } from "@/lib/session";
import { ok, bad, unauthorized, serverError } from "@/lib/api";
import { applyXp, computeStreak, type Category } from "@/lib/progression";

export const dynamic = "force-dynamic";

/**
 * Complete a quest. Server-authoritative: rewards are derived from the stored
 * quest, never trusted from the client (anti-cheat). Returns the delta so the
 * UI can celebrate (level-up, gold gained, streak, etc.).
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getCurrentUserId();
    if (!userId) return unauthorized();

    const result = await prisma.$transaction(async (tx) => {
      const quest = await tx.quest.findUnique({ where: { id: params.id } });
      if (!quest || quest.userId !== userId) {
        return { error: "Quest not found" as const };
      }
      if (quest.completed) {
        return { error: "Quest already completed" as const };
      }

      const character = await tx.character.findUnique({ where: { userId } });
      if (!character) return { error: "Character missing" as const };

      // --- XP & level ---
      const before = { level: character.level, xp: character.xp };
      const after = applyXp(before, quest.xpReward);

      // --- Attribute gain (category maps to a stat) ---
      const attrKey = quest.category as Category;
      const attrIncrement = after.leveledUp ? 2 : 1;

      // --- Streak ---
      const { streak: streakSignal } = computeStreak(
        character.lastActiveDate,
        new Date()
      );
      let newStreak = character.streak;
      if (streakSignal === 0) {
        // Already active today — keep streak.
        newStreak = character.streak;
      } else if (streakSignal === 1) {
        newStreak = character.streak + 1;
      } else {
        // -1 signal or first-ever activity resolved to reset/start.
        newStreak = 1;
      }
      const longestStreak = Math.max(character.longestStreak, newStreak);

      const updatedCharacter = await tx.character.update({
        where: { userId },
        data: {
          level: after.level,
          xp: after.xp,
          totalXp: { increment: quest.xpReward },
          gold: { increment: quest.goldReward },
          [attrKey]: { increment: attrIncrement },
          streak: newStreak,
          longestStreak,
          lastActiveDate: new Date(),
        },
      });

      const updatedQuest = await tx.quest.update({
        where: { id: quest.id },
        data: { completed: true, completedAt: new Date() },
      });

      // --- Activity logs (historical record = persistence proof) ---
      await tx.activityLog.create({
        data: {
          userId,
          type: "quest_complete",
          message: `Completed "${quest.title}" (+${quest.xpReward} XP, +${quest.goldReward} gold)`,
          xpDelta: quest.xpReward,
          goldDelta: quest.goldReward,
        },
      });
      if (after.leveledUp) {
        await tx.activityLog.create({
          data: {
            userId,
            type: "level_up",
            message: `Reached Level ${after.level}!`,
          },
        });
      }

      return {
        quest: updatedQuest,
        character: updatedCharacter,
        rewards: {
          xp: quest.xpReward,
          gold: quest.goldReward,
          attribute: attrKey,
          attributeGain: attrIncrement,
          leveledUp: after.leveledUp,
          levelsGained: after.levelsGained,
          newLevel: after.level,
          streak: newStreak,
        },
      };
    });

    if ("error" in result && result.error) {
      const status = result.error === "Quest not found" ? 404 : 400;
      return bad(result.error, status);
    }

    return ok(result);
  } catch (err) {
    console.error("quest complete error", err);
    return serverError("Could not complete quest");
  }
}
