import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const FEATURES = [
  {
    icon: "⚔️",
    title: "Quests, not chores",
    body: "Log real tasks as quests. Completing them rains XP and gold instantly — no more waiting months for payoff.",
  },
  {
    icon: "📈",
    title: "Non-linear leveling",
    body: "Each level demands more XP than the last. Progress feels earned, and every level-up is a moment.",
  },
  {
    icon: "🧬",
    title: "Five attributes",
    body: "Coding builds Intellect, the gym builds Strength. Categorized quests grow the stats that fit your life.",
  },
  {
    icon: "🔥",
    title: "Streaks",
    body: "Show up daily and watch your streak climb. Miss a day and it resets — the ultimate motivator.",
  },
  {
    icon: "🪙",
    title: "A real economy",
    body: "Bank the gold you earn and spend it in the shop on themes and badges that show off your grind.",
  },
  {
    icon: "☁️",
    title: "Saved forever",
    body: "Everything lives in a secure database tied to your account. Refresh, switch devices — it's all there.",
  },
];

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/dashboard");

  return (
    <main id="main-content" className="relative z-10">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-6 py-6">
        <span className="font-pixel text-sm accent">◆ LIFE RPG</span>
        <nav className="flex items-center gap-3" aria-label="Primary">
          <Link href="/login" className="btn btn-ghost text-sm">
            Log in
          </Link>
          <Link href="/signup" className="btn btn-primary text-sm">
            Start your quest
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pb-10 pt-10 text-center sm:pt-20">
        <p className="muted font-pixel mb-6 text-[10px] tracking-widest sm:text-xs">
          A GAMIFIED PRODUCTIVITY ADVENTURE
        </p>
        <h1 className="font-pixel mx-auto max-w-4xl text-2xl leading-relaxed sm:text-4xl sm:leading-relaxed">
          Turn your <span className="accent">real life</span> into an{" "}
          <span className="accent">epic RPG</span>.
        </h1>
        <p className="muted mx-auto mt-6 max-w-2xl text-base sm:text-lg">
          To-do lists feel like chores because the reward never comes.
          Life RPG closes the gap: finish a task, earn XP and gold, level up
          your character, and keep your streak alive. Instant dopamine for doing
          the things that actually matter.
        </p>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link href="/signup" className="btn btn-primary text-base">
            ⚔️ Begin your adventure
          </Link>
          <Link href="/login" className="btn btn-ghost text-base">
            I already have a hero
          </Link>
        </div>
      </section>

      {/* Features */}
      <section
        className="mx-auto max-w-6xl px-6 py-16"
        aria-label="Features"
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <article key={f.title} className="panel p-6">
              <div className="mb-3 text-3xl" aria-hidden>
                {f.icon}
              </div>
              <h2 className="mb-2 text-lg font-bold">{f.title}</h2>
              <p className="muted text-sm leading-relaxed">{f.body}</p>
            </article>
          ))}
        </div>
      </section>

      <footer className="mx-auto max-w-6xl px-6 py-10 text-center">
        <p className="muted text-xs">
          Built for the Life RPG challenge. Your data is stored securely and
          synced across devices.
        </p>
      </footer>
    </main>
  );
}
