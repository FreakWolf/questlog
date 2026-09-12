"use client";

import { motion } from "framer-motion";
import type { Quest } from "@/lib/client";
import { CATEGORY_META, DIFFICULTY_META } from "@/lib/ui";

export function QuestCard({
  quest,
  onComplete,
  onDelete,
  busy,
}: {
  quest: Quest;
  onComplete: (id: string) => void;
  onDelete: (id: string) => void;
  busy: boolean;
}) {
  const cat = CATEGORY_META[quest.category] ?? CATEGORY_META.discipline;
  const diff = DIFFICULTY_META[quest.difficulty] ?? DIFFICULTY_META.normal;

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      className={`panel flex items-start gap-3 p-4 ${
        quest.completed ? "opacity-60" : ""
      }`}
    >
      {/* Complete checkbox / button */}
      <button
        type="button"
        onClick={() => !quest.completed && onComplete(quest.id)}
        disabled={quest.completed || busy}
        aria-label={
          quest.completed
            ? `${quest.title} completed`
            : `Complete quest: ${quest.title}`
        }
        className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md border-2 transition"
        style={{
          borderColor: quest.completed ? "var(--accent)" : "var(--panel-border)",
          background: quest.completed ? "var(--accent)" : "transparent",
          color: "#0b0710",
          cursor: quest.completed ? "default" : "pointer",
        }}
      >
        {quest.completed ? "✔" : ""}
      </button>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <h3
            className={`font-semibold ${
              quest.completed ? "line-through" : ""
            }`}
          >
            {quest.title}
          </h3>
          <button
            type="button"
            onClick={() => onDelete(quest.id)}
            disabled={busy}
            aria-label={`Delete quest: ${quest.title}`}
            className="muted shrink-0 rounded px-1 text-sm hover:text-[color:var(--accent-2)]"
            title="Delete quest"
          >
            ✕
          </button>
        </div>

        {quest.description && (
          <p className="muted mt-1 text-sm">{quest.description}</p>
        )}

        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
          <span
            className="rounded-full px-2 py-0.5"
            style={{
              background: "color-mix(in srgb, var(--accent) 18%, transparent)",
              color: "var(--text)",
            }}
          >
            {cat.icon} {cat.label}
          </span>
          <span className="muted">{diff.label}</span>
          <span className="accent font-semibold">+{quest.xpReward} XP</span>
          <span style={{ color: "var(--accent-2)" }} className="font-semibold">
            +{quest.goldReward} 🪙
          </span>
        </div>
      </div>
    </motion.li>
  );
}
