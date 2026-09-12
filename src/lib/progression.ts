// ------------------------------------------------------------------
// The RPG Progression Engine
// Non-linear leveling: each level requires progressively more XP.
// ------------------------------------------------------------------

/**
 * XP required to advance FROM the given level to the next one.
 * Non-linear growth: base 100, scaling ~1.35x per level, rounded to a
 * satisfying multiple of 10. Level 1->2 = 100, 2->3 = 140, 3->4 = 180...
 */
export function xpToNextLevel(level: number): number {
  const base = 100;
  const growth = 1.18;
  const raw = base * Math.pow(growth, Math.max(0, level - 1));
  return Math.round(raw / 10) * 10;
}

export const CATEGORIES = [
  "strength",
  "intellect",
  "discipline",
  "vitality",
  "charisma",
] as const;
export type Category = (typeof CATEGORIES)[number];

export const DIFFICULTIES = ["trivial", "normal", "hard", "epic"] as const;
export type Difficulty = (typeof DIFFICULTIES)[number];

/** Base reward table per difficulty. */
export const DIFFICULTY_REWARDS: Record<
  Difficulty,
  { xp: number; gold: number }
> = {
  trivial: { xp: 10, gold: 5 },
  normal: { xp: 20, gold: 10 },
  hard: { xp: 40, gold: 22 },
  epic: { xp: 80, gold: 50 },
};

export interface LevelState {
  level: number;
  xp: number; // xp within current level
}

export interface ApplyXpResult {
  level: number;
  xp: number; // remaining xp within the (possibly new) level
  leveledUp: boolean;
  levelsGained: number;
}

/**
 * Apply an XP gain to a level state, rolling over into new levels as needed.
 * Pure function — safe to unit test and reuse on client for optimistic UI.
 */
export function applyXp(state: LevelState, gain: number): ApplyXpResult {
  let { level, xp } = state;
  xp += Math.max(0, Math.round(gain));
  let levelsGained = 0;

  // Guard against runaway loops with a sane cap.
  while (xp >= xpToNextLevel(level) && level < 999) {
    xp -= xpToNextLevel(level);
    level += 1;
    levelsGained += 1;
  }

  return {
    level,
    xp,
    leveledUp: levelsGained > 0,
    levelsGained,
  };
}

/** Percentage (0-100) of progress toward the next level. */
export function levelProgressPercent(state: LevelState): number {
  const needed = xpToNextLevel(state.level);
  if (needed <= 0) return 0;
  return Math.min(100, Math.round((state.xp / needed) * 100));
}

/**
 * Streak logic. Given the last active date and "now", decide the new streak.
 * - Same calendar day  -> unchanged (already counted today)
 * - Consecutive day    -> +1
 * - Gap of 2+ days     -> reset to 1
 * - No prior activity  -> 1
 */
export function computeStreak(
  lastActive: Date | null,
  now: Date = new Date()
): { streak: number; countedToday: boolean } {
  if (!lastActive) return { streak: 1, countedToday: false };

  const dayMs = 24 * 60 * 60 * 1000;
  const startOf = (d: Date) =>
    new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

  const diffDays = Math.round((startOf(now) - startOf(lastActive)) / dayMs);

  if (diffDays <= 0) return { streak: 0, countedToday: true }; // signal: no change
  if (diffDays === 1) return { streak: 1, countedToday: false }; // increment by 1
  return { streak: -1, countedToday: false }; // signal: reset to 1
}
