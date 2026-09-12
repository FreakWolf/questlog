import { redirect } from "next/navigation";
import { getCurrentUserId } from "@/lib/session";
import { getPlayerState } from "@/lib/playerState";
import Dashboard from "@/components/Dashboard";
import type { PlayerState } from "@/lib/client";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Your Adventure",
};

export default async function DashboardPage() {
  const userId = await getCurrentUserId();
  if (!userId) redirect("/login");

  const state = await getPlayerState(userId);
  // Serialize dates to plain JSON so the client component gets clean data.
  const initial = JSON.parse(JSON.stringify(state)) as PlayerState;

  return <Dashboard initial={initial} />;
}
