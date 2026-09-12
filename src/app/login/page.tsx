"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Wrong email or password. Try again, hero.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <main
      id="main-content"
      className="relative z-10 flex min-h-screen items-center justify-center px-6 py-12"
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="panel panel-accent w-full max-w-md p-8"
      >
        <Link href="/" className="font-pixel accent text-xs">
          ◆ LIFE RPG
        </Link>
        <h1 className="font-pixel mt-6 text-lg">Welcome back</h1>
        <p className="muted mt-2 text-sm">
          Log in to resume your adventure.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="email" className="mb-1 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              className="input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="hero@example.com"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              required
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm" style={{ color: "var(--accent-2)" }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Entering the realm…" : "Log in"}
          </button>
        </form>

        <p className="muted mt-6 text-center text-sm">
          New here?{" "}
          <Link href="/signup" className="accent font-semibold underline">
            Create a hero
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
