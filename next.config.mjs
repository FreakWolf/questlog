// Ensure NEXTAUTH_URL is always a valid, non-empty URL at build & runtime.
// On Vercel, VERCEL_URL is provided automatically (host only). If NEXTAUTH_URL
// isn't explicitly set, derive it so NextAuth never sees an empty value.
function resolveNextAuthUrl() {
  const explicit = process.env.NEXTAUTH_URL?.trim();
  if (explicit) return explicit;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;
  return "http://localhost:3000";
}

process.env.NEXTAUTH_URL = resolveNextAuthUrl();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  },
};

export default nextConfig;
