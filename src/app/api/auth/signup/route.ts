import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, name, betterAuthId } = body;

  if (!email || (!password && !betterAuthId)) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 409 });
  }

  let hashedPassword = null;
  if (password) {
    hashedPassword = await bcrypt.hash(password, 10);
  }

  // Simulate BetterAuth by storing betterAuthId in Account
  const user = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      accounts: betterAuthId
        ? {
            create: {
              type: "oauth",
              provider: "betterauth",
              providerAccountId: betterAuthId,
            },
          }
        : undefined,
    },
    include: { accounts: true },
  });

  // Optionally, create a session here

  return NextResponse.json(
    { user: { ...user, password: undefined } },
    { status: 201 }
  );
}
