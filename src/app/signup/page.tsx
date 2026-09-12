"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { motion } from "framer-motion";
import { apiFetch } from "@/lib/client";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await apiFetch("/api/signup", {
        method: "POST",
        body: JSON.stringify({ name, email, password }),
      });
      // Auto-login after signup.
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
      if (res?.error) {
        router.push("/login");
        return;
      }
      router.push("/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not create account");
      setLoading(false);
    }
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
        <h1 className="font-pixel mt-6 text-lg">Create your hero</h1>
        <p className="muted mt-2 text-sm">
          Every legend starts at Level 1. Let&apos;s roll your character.
        </p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium">
              Hero name
            </label>
            <input
              id="name"
              type="text"
              autoComplete="name"
              required
              maxLength={40}
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sir Codealot"
            />
          </div>
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
              autoComplete="new-password"
              required
              minLength={6}
              className="input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm" style={{ color: "var(--accent-2)" }}>
              {error}
            </p>
          )}

          <button type="submit" className="btn btn-primary w-full" disabled={loading}>
            {loading ? "Forging your hero…" : "⚔️ Begin adventure"}
          </button>
        </form>

        <p className="muted mt-6 text-center text-sm">
          Already have a hero?{" "}
          <Link href="/login" className="accent font-semibold underline">
            Log in
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
