# ⚔️ Life RPG

> Turn your real life into an epic RPG. Complete real-world tasks as **quests**, earn **XP** and **gold**, **level up** your character's attributes, keep your **streak** alive, and spend gold in the **shop**.

Traditional to-do apps suffer from delayed gratification — the reward for reading a book or hitting the gym takes months to show up. **Life RPG** closes that gap with instant, game-like feedback loops: every completed task rains XP and gold, every level-up is a celebration, and all of it is saved to a secure backend so your progress follows you across devices.

---

## ✨ Features

- **🔐 Secure authentication** — email + password signup/login with hashed passwords (bcrypt) and JWT sessions via NextAuth. Every user only ever sees and edits their own data.
- **📝 Full quest CRUD** — create, read, update, complete, and delete quests. Each quest maps to an attribute and a difficulty.
- **📈 Non-linear progression engine** — XP required per level scales geometrically (`100 × 1.18^(level-1)`), so every level is harder-won than the last. **Rewards are calculated server-side** so stats can't be cheated from the client.
- **🧬 Five character attributes** — Strength, Intellect, Discipline, Vitality, and Charisma. Categorized quests level up the matching stat (coding → Intellect, gym → Strength).
- **🔥 Streaks** — consecutive-day activity tracking with a "longest streak" record. Miss a day and it resets.
- **🪙 Economy & shop** — earn gold from quests and spend it on unlockable **themes** and collectible **badges**. Purchases are validated server-side against your balance.
- **🎨 Three cohesive themes** — Dungeon Crawler, Emerald Grove, and Neon Spire (cyberpunk), swappable live once unlocked.
- **💫 Alive & tactile UI** — spring animations, a particle level-up burst, optimistic updates, loading skeletons, and celebratory reward toasts.
- **☁️ Real persistence** — everything lives in a relational database (Prisma). Refresh the page or switch devices; your hero is exactly where you left it.
- **♿ Accessible & responsive** — full keyboard navigation (including arrow-key tabs), ARIA roles, semantic HTML, visible focus states, `prefers-reduced-motion` support, and a mobile-first responsive layout.

---

## 🧱 Tech Stack

| Layer        | Technology                                             |
| ------------ | ------------------------------------------------------ |
| Framework    | [Next.js 14](https://nextjs.org/) (App Router) + React |
| Language     | TypeScript                                             |
| Styling      | Tailwind CSS + CSS variables (theming)                 |
| Animation    | Framer Motion                                          |
| Auth         | NextAuth (Credentials provider, JWT sessions)          |
| ORM          | Prisma                                                 |
| Database     | SQLite (local dev) · PostgreSQL (production)           |
| Validation   | Zod                                                    |

---

## 🚀 Getting Started (Local)

### Prerequisites

- **Node.js 18+** and npm

### 1. Install dependencies

```bash
npm install
```

> **Note for npm 9+:** package install scripts may be blocked by default. If `@prisma/client` isn't generated, run `npx prisma generate` manually (the `db:push` step below also generates it).

### 2. Set up environment variables

Copy the example file and fill in the values:

```bash
cp .env.example .env
```

The defaults in `.env.example` work out-of-the-box for local development with SQLite. Generate a real `NEXTAUTH_SECRET` with:

```bash
openssl rand -base64 32
```

### 3. Create and seed the database

```bash
npm run db:push   # creates the SQLite dev.db and syncs the schema
npm run db:seed   # seeds the shop catalog (themes + badges)
```

### 4. Run the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), create a hero, and start questing.

---

## 🔧 Available Scripts

| Script             | Description                                        |
| ------------------ | -------------------------------------------------- |
| `npm run dev`      | Start the dev server                               |
| `npm run build`    | Generate the Prisma client and build for production|
| `npm run start`    | Start the production server                        |
| `npm run lint`     | Run ESLint                                         |
| `npm run db:push`  | Sync the Prisma schema to the database             |
| `npm run db:seed`  | Seed the shop items                                |
| `npm run db:studio`| Open Prisma Studio to inspect the database         |

---

## 🌍 Environment Variables

See [`.env.example`](./.env.example) for the full template.

| Variable          | Required | Description                                                        |
| ----------------- | :------: | ------------------------------------------------------------------ |
| `DATABASE_URL`    |    ✅    | Connection string. `file:./dev.db` for SQLite, or a Postgres URL.  |
| `NEXTAUTH_URL`    |    ✅    | Canonical site URL (`http://localhost:3000` locally).              |
| `NEXTAUTH_SECRET` |    ✅    | Random string used to sign session tokens.                         |

---

## ☁️ Deployment (Production with PostgreSQL)

The app ships configured for SQLite locally. For a live deployment, switch to a hosted PostgreSQL database (serverless platforms have read-only/ephemeral filesystems, so SQLite won't persist there).

### 1. Provision a Postgres database

Use a free hosted Postgres such as [Neon](https://neon.tech), [Supabase](https://supabase.com), or [Railway](https://railway.app). Copy the connection string.

### 2. Switch the Prisma datasource to Postgres

In [`prisma/schema.prisma`](./prisma/schema.prisma), change:

```prisma
datasource db {
  provider = "postgresql"   // was "sqlite"
  url      = env("DATABASE_URL")
}
```

### 3. Set environment variables on your host

In your hosting provider's dashboard (e.g. Vercel), set:

```
DATABASE_URL   = postgresql://USER:PASSWORD@HOST:5432/DBNAME?sslmode=require
NEXTAUTH_URL   = https://your-app.vercel.app
NEXTAUTH_SECRET = <output of: openssl rand -base64 32>
```

### 4. Push the schema and seed the catalog

Run once against the production database (locally, with the production `DATABASE_URL` set):

```bash
npx prisma db push
npm run db:seed
```

### 5. Deploy

Push to GitHub and import the repo into [Vercel](https://vercel.com) (or Render/Railway). The build command is `npm run build`, which runs `prisma generate` automatically. Deploy and you're live.

> **Deploy on Vercel:** the included `build` script handles Prisma client generation. Just make sure the three environment variables above are set in the Vercel project settings before the first deploy.

---

## 🏛️ Architecture

```
src/
├── app/
│   ├── page.tsx                 # Landing page (redirects to /dashboard if logged in)
│   ├── login/ , signup/         # Auth pages
│   ├── dashboard/
│   │   ├── page.tsx             # Server component: auth guard + initial state fetch
│   │   └── loading.tsx          # Route-level skeleton
│   ├── layout.tsx               # Fonts, SEO metadata, providers, skip link
│   ├── globals.css              # Theme system (CSS vars) + component styles
│   ├── robots.ts , sitemap.ts   # SEO
│   └── api/
│       ├── signup/              # Create account + starting character
│       ├── auth/[...nextauth]/  # NextAuth handler
│       ├── state/               # Full player state (dashboard hydration)
│       ├── quests/              # GET (list) + POST (create)
│       ├── quests/[id]/         # PATCH (edit) + DELETE
│       ├── quests/[id]/complete/# POST — the progression engine (server-authoritative)
│       ├── shop/purchase/       # POST — buy an item (balance-checked)
│       └── character/theme/     # POST — equip an owned theme
├── components/                  # Dashboard, CharacterPanel, QuestForm, QuestCard,
│                                #   Shop, ActivityLog, LevelUpBurst, Toast, Providers
└── lib/
    ├── prisma.ts                # Prisma client singleton
    ├── auth.ts , session.ts     # NextAuth config + current-user helper
    ├── progression.ts           # Pure leveling/streak math (reused client + server)
    ├── playerState.ts           # Aggregated state loader
    ├── api.ts , client.ts       # Server response + client fetch helpers
    └── ui.ts                    # Category/difficulty/theme metadata
prisma/
├── schema.prisma                # Data model
└── seed.ts                      # Shop catalog seed
```

### Data model

- **User** — account + credentials (hashed).
- **Character** — 1:1 with User. Level, XP, gold, five attributes, streak, longest streak, equipped theme.
- **Quest** — a task owned by a user, with category (→ attribute), difficulty, and XP/gold rewards.
- **ShopItem** — the shared catalog (themes, badges).
- **InventoryItem** — items a user owns (join between User and ShopItem).
- **ActivityLog** — a historical record of completions, level-ups, and purchases — powers the Chronicle and proves persistence.

### Anti-cheat

The client never dictates rewards. When a quest is completed, the server reads the stored quest, computes XP/gold/attribute gains and level-ups inside a single database transaction, and returns the authoritative result. Purchases similarly validate the user's gold balance server-side before granting an item.

---

## ♿ Accessibility

- Keyboard-navigable throughout; the section tabs support arrow-key navigation with a roving tabindex.
- Semantic landmarks (`header`, `main`, `section`, `nav`) and a "Skip to content" link.
- ARIA roles and labels on interactive widgets; the XP bar is an announced `progressbar`.
- Reward and status changes are announced via an `aria-live` region.
- Visible focus indicators and full `prefers-reduced-motion` support.

> Automated checks and manual keyboard testing were performed. Full WCAG conformance additionally requires testing with assistive technologies (screen readers) and expert review.

---

## 🎬 Walkthrough Video

_A 90–180s screen recording demonstrating signup/login, adding and completing a quest, leveling up, and a page refresh proving database persistence._

**➡️ [Add your video link here]** (host in-repo under `/media` or via an accessible public link).

---

## 📜 License

Built for the Life RPG challenge. MIT.
