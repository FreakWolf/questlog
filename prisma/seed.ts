import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Catalog of items the shop sells. Idempotent upsert by slug.
const SHOP_ITEMS = [
  {
    slug: "theme-dungeon",
    name: "Dungeon Crawler",
    description: "The default torch-lit stone dungeon theme. Cozy and dark.",
    type: "theme",
    cost: 0,
    icon: "🏰",
    payload: "dungeon",
  },
  {
    slug: "theme-emerald",
    name: "Emerald Grove",
    description: "A verdant, glowing forest palette for nature-attuned heroes.",
    type: "theme",
    cost: 150,
    icon: "🌿",
    payload: "emerald",
  },
  {
    slug: "theme-cyber",
    name: "Neon Spire",
    description: "A sleek cyberpunk skin drenched in electric blues and magenta.",
    type: "theme",
    cost: 250,
    icon: "🌆",
    payload: "cyber",
  },
  {
    slug: "badge-early-bird",
    name: "Early Bird Badge",
    description: "Proof you rise before the sun. Worn with pride on your profile.",
    type: "badge",
    cost: 80,
    icon: "🐤",
    payload: null,
  },
  {
    slug: "badge-iron-will",
    name: "Iron Will Badge",
    description: "For heroes who never break a streak. A mark of true discipline.",
    type: "badge",
    cost: 120,
    icon: "🛡️",
    payload: null,
  },
  {
    slug: "badge-scholar",
    name: "Arcane Scholar Badge",
    description: "Awarded to the endlessly curious. Radiates faint arcane light.",
    type: "badge",
    cost: 120,
    icon: "📜",
    payload: null,
  },
  {
    slug: "consumable-xp-potion",
    name: "Potion of Insight",
    description: "A collectible trophy commemorating a big grind session.",
    type: "badge",
    cost: 60,
    icon: "🧪",
    payload: null,
  },
];

async function main() {
  console.log("Seeding shop items...");
  for (const item of SHOP_ITEMS) {
    await prisma.shopItem.upsert({
      where: { slug: item.slug },
      update: {
        name: item.name,
        description: item.description,
        type: item.type,
        cost: item.cost,
        icon: item.icon,
        payload: item.payload,
      },
      create: item,
    });
  }
  console.log(`Seeded ${SHOP_ITEMS.length} shop items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
