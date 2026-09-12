"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { AnimatePresence } from "framer-motion";
import type {
  PlayerState,
  Quest,
  ActivityLog as Log,
} from "@/lib/client";
import { apiFetch } from "@/lib/client";
import { DIFFICULTY_META } from "@/lib/ui";
import { useToast } from "@/components/Toast";
import { CharacterPanel } from "@/components/CharacterPanel";
import { QuestForm, type QuestDraft } from "@/components/QuestForm";
import { QuestCard } from "@/components/QuestCard";
import { Shop } from "@/components/Shop";
import { ActivityLog } from "@/components/ActivityLog";
import { LevelUpBurst } from "@/components/LevelUpBurst";

type Tab = "quests" | "shop" | "chronicle";

export default function Dashboard({ initial }: { initial: PlayerState }) {
  const { push } = useToast();
  const [state, setState] = useState<PlayerState>(initial);
  const [tab, setTab] = useState<Tab>("quests");
  const [creating, setCreating] = useState(false);
  const [busyQuest, setBusyQuest] = useState(false);
  const [busySlug, setBusySlug] = useState<string | null>(null);
  const [levelUp, setLevelUp] = useState<number | null>(null);

  // Apply the equipped theme to the document.
  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      state.character.equippedTheme || "dungeon"
    );
  }, [state.character.equippedTheme]);

  const refresh = useCallback(async () => {
    try {
      const fresh = await apiFetch<PlayerState>("/api/state");
      setState(fresh);
    } catch {
      /* keep current state on transient failure */
    }
  }, []);

  const activeQuests = useMemo(
    () => state.quests.filter((q) => !q.completed),
    [state.quests]
  );
  const doneQuests = useMemo(
    () => state.quests.filter((q) => q.completed),
    [state.quests]
  );

  // ---- Create quest (optimistic) ----
  async function handleCreate(draft: QuestDraft) {
    setCreating(true);
    const rewards = DIFFICULTY_META[draft.difficulty];
    const tempId = `temp-${Date.now()}`;
    const optimistic: Quest = {
      id: tempId,
      title: draft.title,
      description: draft.description || null,
      category: draft.category,
      difficulty: draft.difficulty,
      xpReward: rewards.xp,
      goldReward: rewards.gold,
      completed: false,
      completedAt: null,
      createdAt: new Date().toISOString(),
    };
    setState((s) => ({ ...s, quests: [optimistic, ...s.quests] }));

    try {
      const created = await apiFetch<Quest>("/api/quests", {
        method: "POST",
        body: JSON.stringify(draft),
      });
      setState((s) => ({
        ...s,
        quests: s.quests.map((q) => (q.id === tempId ? created : q)),
      }));
      push("Quest added to your board", "success");
    } catch (err) {
      // rollback
      setState((s) => ({
        ...s,
        quests: s.quests.filter((q) => q.id !== tempId),
      }));
      push(err instanceof Error ? err.message : "Could not add quest", "error");
    } finally {
      setCreating(false);
    }
  }

  // ---- Complete quest ----
  async function handleComplete(id: string) {
    if (id.startsWith("temp-")) return;
    setBusyQuest(true);
    try {
      const res = await apiFetch<{
        rewards: {
          xp: number;
          gold: number;
          leveledUp: boolean;
          newLevel: number;
          streak: number;
        };
        character: PlayerState["character"];
      }>(`/api/quests/${id}/complete`, { method: "POST" });

      // Update character + mark quest complete + prepend a log locally.
      const newLog: Log = {
        id: `log-${Date.now()}`,
        type: "quest_complete",
        message: `Completed quest (+${res.rewards.xp} XP, +${res.rewards.gold} gold)`,
        xpDelta: res.rewards.xp,
        goldDelta: res.rewards.gold,
        createdAt: new Date().toISOString(),
      };
      setState((s) => ({
        ...s,
        character: res.character,
        quests: s.quests.map((q) =>
          q.id === id ? { ...q, completed: true, completedAt: newLog.createdAt } : q
        ),
        logs: [newLog, ...s.logs],
      }));

      push(`+${res.rewards.xp} XP · +${res.rewards.gold} 🪙`, "reward");
      if (res.rewards.leveledUp) {
        setLevelUp(res.rewards.newLevel);
      }
      // Reconcile with server (streak logs, exact ordering).
      refresh();
    } catch (err) {
      push(err instanceof Error ? err.message : "Could not complete quest", "error");
    } finally {
      setBusyQuest(false);
    }
  }

  // ---- Delete quest (optimistic) ----
  async function handleDelete(id: string) {
    const prev = state.quests;
    setState((s) => ({ ...s, quests: s.quests.filter((q) => q.id !== id) }));
    if (id.startsWith("temp-")) return;
    try {
      await apiFetch(`/api/quests/${id}`, { method: "DELETE" });
      push("Quest removed", "info");
    } catch (err) {
      setState((s) => ({ ...s, quests: prev }));
      push(err instanceof Error ? err.message : "Could not delete", "error");
    }
  }

  // ---- Shop ----
  async function handleBuy(slug: string) {
    setBusySlug(slug);
    try {
      const res = await apiFetch<{
        character: PlayerState["character"];
        item: { name: string };
      }>("/api/shop/purchase", {
        method: "POST",
        body: JSON.stringify({ slug }),
      });
      setState((s) => ({
        ...s,
        character: res.character,
        shop: s.shop.map((i) => (i.slug === slug ? { ...i, owned: true } : i)),
      }));
      push(`Purchased ${res.item.name}!`, "success");
      refresh();
    } catch (err) {
      push(err instanceof Error ? err.message : "Purchase failed", "error");
    } finally {
      setBusySlug(null);
    }
  }

  async function handleEquip(theme: string) {
    setBusySlug(theme);
    try {
      const res = await apiFetch<{ character: PlayerState["character"] }>(
        "/api/character/theme",
        { method: "POST", body: JSON.stringify({ theme }) }
      );
      setState((s) => ({ ...s, character: res.character }));
      push("Theme equipped", "success");
    } catch (err) {
      push(err instanceof Error ? err.message : "Could not equip", "error");
    } finally {
      setBusySlug(null);
    }
  }

  const name = state.user?.name ?? "Hero";

  return (
    <div className="relative z-10 min-h-screen">
      <LevelUpBurst level={levelUp} onDone={() => setLevelUp(null)} />

      {/* Header */}
      <header className="border-b" style={{ borderColor: "var(--panel-border)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="font-pixel text-xs accent sm:text-sm">◆ LIFE RPG</span>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm sm:inline muted">
              Playing as <span className="accent font-semibold">{name}</span>
            </span>
            <button
              type="button"
              onClick={() => signOut({ callbackUrl: "/" })}
              className="btn btn-ghost px-3 py-1.5 text-sm"
            >
              Log out
            </button>
          </div>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8"
      >
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          {/* Left: character */}
          <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
            <CharacterPanel character={state.character} name={name} />
          </div>

          {/* Right: tabbed content */}
          <div className="space-y-6">
            {/* Tabs */}
            <div
              className="flex gap-2"
              role="tablist"
              aria-label="Dashboard sections"
              onKeyDown={(e) => {
                if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
                e.preventDefault();
                const order: Tab[] = ["quests", "shop", "chronicle"];
                const idx = order.indexOf(tab);
                const next =
                  e.key === "ArrowRight"
                    ? order[(idx + 1) % order.length]
                    : order[(idx - 1 + order.length) % order.length];
                setTab(next);
                document.getElementById(`tab-${next}`)?.focus();
              }}
            >
              {(
                [
                  ["quests", "⚔️ Quests"],
                  ["shop", "🏪 Shop"],
                  ["chronicle", "📜 Chronicle"],
                ] as [Tab, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={tab === key}
                  aria-controls={`panel-${key}`}
                  id={`tab-${key}`}
                  tabIndex={tab === key ? 0 : -1}
                  onClick={() => setTab(key)}
                  className={`btn px-4 py-2 text-sm ${
                    tab === key ? "btn-primary" : "btn-ghost"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            {tab === "quests" && (
              <div
                id="panel-quests"
                role="tabpanel"
                aria-labelledby="tab-quests"
                className="space-y-6"
              >
                <QuestForm onCreate={handleCreate} submitting={creating} />

                <section aria-label="Active quests">
                  <h2 className="mb-3 flex items-center gap-2 text-sm font-bold">
                    Active quests
                    <span className="muted font-normal">
                      ({activeQuests.length})
                    </span>
                  </h2>
                  {activeQuests.length === 0 ? (
                    <p className="panel muted p-6 text-center text-sm">
                      No active quests. Add one above to start earning XP.
                    </p>
                  ) : (
                    <ul className="space-y-3">
                      <AnimatePresence initial={false}>
                        {activeQuests.map((q) => (
                          <QuestCard
                            key={q.id}
                            quest={q}
                            onComplete={handleComplete}
                            onDelete={handleDelete}
                            busy={busyQuest}
                          />
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </section>

                {doneQuests.length > 0 && (
                  <section aria-label="Completed quests">
                    <h2 className="mb-3 text-sm font-bold muted">
                      Completed ({doneQuests.length})
                    </h2>
                    <ul className="space-y-3">
                      <AnimatePresence initial={false}>
                        {doneQuests.slice(0, 10).map((q) => (
                          <QuestCard
                            key={q.id}
                            quest={q}
                            onComplete={handleComplete}
                            onDelete={handleDelete}
                            busy={busyQuest}
                          />
                        ))}
                      </AnimatePresence>
                    </ul>
                  </section>
                )}
              </div>
            )}

            {tab === "shop" && (
              <div id="panel-shop" role="tabpanel" aria-labelledby="tab-shop">
                <Shop
                  items={state.shop}
                  character={state.character}
                  onBuy={handleBuy}
                  onEquip={handleEquip}
                  busySlug={busySlug}
                />
              </div>
            )}

            {tab === "chronicle" && (
              <div
                id="panel-chronicle"
                role="tabpanel"
                aria-labelledby="tab-chronicle"
              >
                <ActivityLog logs={state.logs} />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
