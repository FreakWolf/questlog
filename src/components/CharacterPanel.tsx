"use client";

import { motion } from "framer-motion";
import type { Character } from "@/lib/client";
import { xpToNextLevel, levelProgressPercent } from "@/lib/progression";
import { CATEGORY_META } from "@/lib/ui";

export function CharacterPanel({
  character,
  name,
}: {
  character: Character;
  name: string;
}) {
  const needed = xpToNextLevel(character.level);
  const percent = levelProgressPercent({
    level: character.level,
    xp: character.xp,
  });

  const attrs = ["strength", "intellect", "discipline", "vitality", "charisma"] as const;

  return (
    <section className="panel panel-accent p-5" aria-label="Character summary">
      <div className="flex items-center gap-4">
        <motion.div
          key={character.level}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 18 }}
          className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl text-2xl font-pixel"
          style={{
            background:
              "linear-gradient(160deg, var(--accent), color-mix(in srgb, var(--accent) 50%, black))",
            color: "#0b0710",
            boxShadow: "0 0 22px -6px var(--glow)",
          }}
          aria-hidden
        >
          {character.level}
        </motion.div>
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold">{name}</h2>
          <p className="muted text-xs font-pixel">LEVEL {character.level}</p>
        </div>
      </div>

      {/* XP bar */}
      <div className="mt-5">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="muted">XP</span>
          <span className="tabular-nums">
            {character.xp} / {needed}
          </span>
        </div>
        <div
          className="xp-track h-4 w-full rounded-full"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={needed}
          aria-valuenow={character.xp}
          aria-label={`Experience toward level ${character.level + 1}`}
        >
          <div
            className="xp-fill h-full rounded-full"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

      {/* Currency + streak */}
      <div className="mt-5 grid grid-cols-3 gap-3 text-center">
        <Stat label="Gold" value={character.gold} icon="🪙" />
        <Stat label="Streak" value={`${character.streak}d`} icon="🔥" />
        <Stat label="Best" value={`${character.longestStreak}d`} icon="🏆" />
      </div>

      {/* Attributes */}
      <div className="mt-6">
        <h3 className="muted mb-3 text-xs font-pixel">ATTRIBUTES</h3>
        <ul className="space-y-2">
          {attrs.map((a) => (
            <li key={a} className="flex items-center gap-3 text-sm">
              <span aria-hidden className="w-6 text-center">
                {CATEGORY_META[a].icon}
              </span>
              <span className="w-24">{CATEGORY_META[a].label}</span>
              <span
                className="tabular-nums font-bold accent"
                aria-label={`${CATEGORY_META[a].label} ${character[a]}`}
              >
                {character[a]}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="panel rounded-lg px-2 py-3">
      <div className="text-xl" aria-hidden>
        {icon}
      </div>
      <div className="mt-1 text-base font-bold tabular-nums">{value}</div>
      <div className="muted text-[10px] uppercase tracking-wide">{label}</div>
    </div>
  );
}
