import type { Metadata, Viewport } from "next";
import { Press_Start_2P, Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { getSiteUrl } from "@/lib/siteUrl";

const pixel = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pixel",
  display: "swap",
});

const body = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Life RPG — Turn Your Life Into an Adventure",
    template: "%s · Life RPG",
  },
  description:
    "Life RPG transforms your real-world tasks into epic quests. Earn XP, level up your character's attributes, keep streaks alive, and spend gold in the shop. A gamified productivity app.",
  keywords: [
    "gamified productivity",
    "habit tracker",
    "life rpg",
    "quest tracker",
    "to-do gamification",
    "xp leveling app",
  ],
  authors: [{ name: "Life RPG" }],
  openGraph: {
    title: "Life RPG — Turn Your Life Into an Adventure",
    description:
      "Turn mundane tasks into epic quests. Earn XP, level up, keep streaks, and spend gold.",
    type: "website",
    url: siteUrl,
    siteName: "Life RPG",
  },
  twitter: {
    card: "summary_large_image",
    title: "Life RPG — Turn Your Life Into an Adventure",
    description: "Turn mundane tasks into epic quests. Earn XP, level up, and keep your streak alive.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#140d20",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${pixel.variable} ${body.variable}`}>
      <body>
        <a href="#main-content" className="skip-link">
          Skip to content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
