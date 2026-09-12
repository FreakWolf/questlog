"use client";

import type { ActivityLog as Log } from "@/lib/client";

const ICONS: Record<string, string> = {
  quest_complete: "⚔️",
  level_up: "⬆️",
  purchase: "🛒",
  streak: "🔥",
};

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export function ActivityLog({ logs }: { logs: Log[] }) {
  return (
    <section className="panel p-5" aria-label="Activity log">
      <h2 className="font-pixel mb-4 text-sm accent">📜 CHRONICLE</h2>
      {logs.length === 0 ? (
        <p className="muted text-sm">
          Your legend is unwritten. Complete a quest to begin.
        </p>
      ) : (
        <ul className="space-y-3">
          {logs.slice(0, 12).map((log) => (
            <li key={log.id} className="flex items-start gap-3 text-sm">
              <span aria-hidden className="mt-0.5">
                {ICONS[log.type] ?? "•"}
              </span>
              <div className="min-w-0 flex-1">
                <p className="leading-snug">{log.message}</p>
                <time
                  className="muted text-[11px]"
                  dateTime={log.createdAt}
                >
                  {timeAgo(log.createdAt)}
                </time>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
