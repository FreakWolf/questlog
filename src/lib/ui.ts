// Shared UI metadata for categories & difficulties.

export const CATEGORY_META: Record<
  string,
  { label: string; attr: string; icon: string; blurb: string }
> = {
  strength: {
    label: "Strength",
    attr: "strength",
    icon: "💪",
    blurb: "Gym, sports, physical work",
  },
  intellect: {
    label: "Intellect",
    attr: "intellect",
    icon: "🧠",
    blurb: "Study, coding, reading",
  },
  discipline: {
    label: "Discipline",
    attr: "discipline",
    icon: "🎯",
    blurb: "Habits, chores, focus",
  },
  vitality: {
    label: "Vitality",
    attr: "vitality",
    icon: "❤️",
    blurb: "Sleep, meals, self-care",
  },
  charisma: {
    label: "Charisma",
    attr: "charisma",
    icon: "🗣️",
    blurb: "Social, networking, creativity",
  },
};

export const DIFFICULTY_META: Record<
  string,
  { label: string; icon: string; xp: number; gold: number }
> = {
  trivial: { label: "Trivial", icon: "○", xp: 10, gold: 5 },
  normal: { label: "Normal", icon: "◆", xp: 20, gold: 10 },
  hard: { label: "Hard", icon: "◆◆", xp: 40, gold: 22 },
  epic: { label: "Epic", icon: "★", xp: 80, gold: 50 },
};

export const THEME_LABELS: Record<string, string> = {
  dungeon: "Dungeon Crawler",
  emerald: "Emerald Grove",
  cyber: "Neon Spire",
};
