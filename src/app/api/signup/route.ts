import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, bad, serverError } from "@/lib/api";

const signupSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(40),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters").max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return bad(parsed.error.issues[0]?.message ?? "Invalid input");
    }
    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return bad("An account with that email already exists", 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    // Create user + their starting character in one transaction.
    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        character: {
          create: {
            // Starting theme is free/owned by default.
          },
        },
      },
    });

    // Grant the free default theme in inventory (best-effort).
    const defaultTheme = await prisma.shopItem.findUnique({
      where: { slug: "theme-dungeon" },
    });
    if (defaultTheme) {
      await prisma.inventoryItem.create({
        data: { userId: user.id, shopItemId: defaultTheme.id },
      });
    }

    return ok({ id: user.id, email: user.email, name: user.name }, 201);
  } catch (err) {
    console.error("signup error", err);
    return serverError("Could not create account");
  }
}
