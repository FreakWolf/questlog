// Tiny fetch wrapper for the client with consistent error handling.

export async function apiFetch<T = unknown>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const isJson = res.headers
    .get("content-type")
    ?.includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const message =
      (data && (data.error as string)) || `Request failed (${res.status})`;
    throw new Error(message);
  }
  return data as T;
}

// ---- Shared front-end types (mirror the API shapes) ----

export interface Character {
  id: string;
  level: number;
  xp: number;
  totalXp: number;
  gold: number;
  strength: number;
  intellect: number;
  discipline: number;
  vitality: number;
  charisma: number;
  streak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  equippedTheme: string;
}

export interface Quest {
  id: string;
  title: string;
  description: string | null;
  category: string;
  difficulty: string;
  xpReward: number;
  goldReward: number;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
}

export interface ShopItem {
  id: string;
  slug: string;
  name: string;
  description: string;
  type: string;
  cost: number;
  icon: string;
  payload: string | null;
  owned: boolean;
}

export interface InventoryEntry {
  id: string;
  acquiredAt: string;
  item: Omit<ShopItem, "owned">;
}

export interface ActivityLog {
  id: string;
  type: string;
  message: string;
  xpDelta: number;
  goldDelta: number;
  createdAt: string;
}

export interface PlayerState {
  user: { id: string; name: string; email: string; createdAt: string } | null;
  character: Character;
  quests: Quest[];
  inventory: InventoryEntry[];
  logs: ActivityLog[];
  shop: ShopItem[];
}
