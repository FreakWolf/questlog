"use client";

import { motion } from "framer-motion";
import type { ShopItem, Character } from "@/lib/client";

export function Shop({
  items,
  character,
  onBuy,
  onEquip,
  busySlug,
}: {
  items: ShopItem[];
  character: Character;
  onBuy: (slug: string) => void;
  onEquip: (theme: string) => void;
  busySlug: string | null;
}) {
  return (
    <section className="panel p-5" aria-label="Shop">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-pixel text-sm accent">🏪 SHOP</h2>
        <span className="text-sm" style={{ color: "var(--accent-2)" }}>
          🪙 {character.gold}
        </span>
      </div>

      <ul className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const isTheme = item.type === "theme";
          const equipped =
            isTheme && item.payload === character.equippedTheme;
          const affordable = character.gold >= item.cost;
          const busy = busySlug === item.slug;

          return (
            <motion.li
              key={item.id}
              layout
              className="panel flex flex-col gap-2 p-4"
            >
              <div className="flex items-center gap-2">
                <span className="text-2xl" aria-hidden>
                  {item.icon}
                </span>
                <div>
                  <h3 className="text-sm font-bold leading-tight">
                    {item.name}
                  </h3>
                  <span className="muted text-[10px] uppercase tracking-wide">
                    {item.type}
                  </span>
                </div>
              </div>
              <p className="muted text-xs leading-relaxed">
                {item.description}
              </p>

              <div className="mt-auto flex items-center justify-between pt-2">
                <span
                  className="text-sm font-semibold"
                  style={{ color: "var(--accent-2)" }}
                >
                  {item.cost === 0 ? "Free" : `🪙 ${item.cost}`}
                </span>

                {!item.owned && (
                  <button
                    type="button"
                    onClick={() => onBuy(item.slug)}
                    disabled={!affordable || busy}
                    className="btn btn-primary px-3 py-1 text-xs"
                    aria-label={`Buy ${item.name} for ${item.cost} gold`}
                  >
                    {busy ? "…" : affordable ? "Buy" : "Need gold"}
                  </button>
                )}

                {item.owned && isTheme && !equipped && (
                  <button
                    type="button"
                    onClick={() => onEquip(item.payload!)}
                    disabled={busy}
                    className="btn btn-ghost px-3 py-1 text-xs"
                  >
                    Equip
                  </button>
                )}

                {item.owned && isTheme && equipped && (
                  <span className="accent text-xs font-semibold">Equipped</span>
                )}

                {item.owned && !isTheme && (
                  <span className="accent text-xs font-semibold">Owned ✓</span>
                )}
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
