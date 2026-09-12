// Route-level skeleton shown while the dashboard server component loads state.
export default function DashboardLoading() {
  return (
    <div className="relative z-10 min-h-screen">
      <header
        className="border-b"
        style={{ borderColor: "var(--panel-border)" }}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <span className="font-pixel text-xs accent sm:text-sm">◆ LIFE RPG</span>
          <div className="skeleton h-8 w-24 rounded-lg" />
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:py-8">
        <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
          <div className="skeleton h-80 rounded-xl" aria-hidden />
          <div className="space-y-6">
            <div className="flex gap-2">
              <div className="skeleton h-10 w-28 rounded-lg" />
              <div className="skeleton h-10 w-24 rounded-lg" />
              <div className="skeleton h-10 w-32 rounded-lg" />
            </div>
            <div className="skeleton h-56 rounded-xl" aria-hidden />
            <div className="skeleton h-24 rounded-xl" aria-hidden />
            <div className="skeleton h-24 rounded-xl" aria-hidden />
          </div>
        </div>
        <p className="sr-only" role="status">
          Loading your adventure…
        </p>
      </main>
    </div>
  );
}
