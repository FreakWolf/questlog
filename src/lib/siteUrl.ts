// Resolve the canonical site URL robustly for both local dev and Vercel.
// Never returns an empty/invalid value, so `new URL(...)` can't throw at build.
export function getSiteUrl(): string {
  const candidates = [
    process.env.NEXTAUTH_URL,
    // Vercel provides this automatically (host only, no protocol).
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    "http://localhost:3000",
  ];

  for (const c of candidates) {
    if (!c) continue;
    const value = c.trim();
    if (!value) continue;
    try {
      // Validate; throws if malformed.
      return new URL(value).toString().replace(/\/$/, "");
    } catch {
      // try next candidate
    }
  }
  return "http://localhost:3000";
}
