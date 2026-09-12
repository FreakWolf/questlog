"use client";

import { useState } from "react";
import { CATEGORY_META, DIFFICULTY_META } from "@/lib/ui";

export interface QuestDraft {
  title: string;
  description: string;
  category: string;
  difficulty: string;
}

export function QuestForm({
  onCreate,
  submitting,
}: {
  onCreate: (draft: QuestDraft) => Promise<void> | void;
  submitting: boolean;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("intellect");
  const [difficulty, setDifficulty] = useState("normal");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError("Give your quest a name.");
      return;
    }
    setError(null);
    await onCreate({ title: title.trim(), description: description.trim(), category, difficulty });
    setTitle("");
    setDescription("");
  }

  return (
    <form onSubmit={handleSubmit} className="panel p-5" aria-label="Add a new quest">
      <h2 className="font-pixel mb-4 text-sm accent">✦ NEW QUEST</h2>

      <div className="space-y-3">
        <div>
          <label htmlFor="q-title" className="mb-1 block text-sm font-medium">
            Quest
          </label>
          <input
            id="q-title"
            className="input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Read 20 pages"
            maxLength={120}
            required
          />
        </div>

        <div>
          <label htmlFor="q-desc" className="mb-1 block text-sm font-medium">
            Notes <span className="muted">(optional)</span>
          </label>
          <input
            id="q-desc"
            className="input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Any details…"
            maxLength={500}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label htmlFor="q-cat" className="mb-1 block text-sm font-medium">
              Attribute
            </label>
            <select
              id="q-cat"
              className="input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {Object.entries(CATEGORY_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.icon} {meta.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="q-diff" className="mb-1 block text-sm font-medium">
              Difficulty
            </label>
            <select
              id="q-diff"
              className="input"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              {Object.entries(DIFFICULTY_META).map(([key, meta]) => (
                <option key={key} value={key}>
                  {meta.label} · +{meta.xp} XP
                </option>
              ))}
            </select>
          </div>
        </div>

        {error && (
          <p role="alert" className="text-sm" style={{ color: "var(--accent-2)" }}>
            {error}
          </p>
        )}

        <button type="submit" className="btn btn-primary w-full" disabled={submitting}>
          {submitting ? "Adding…" : "＋ Add quest"}
        </button>
      </div>
    </form>
  );
}
