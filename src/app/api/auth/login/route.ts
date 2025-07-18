import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, betterAuthId } = body;

  if (!email || (!password && !betterAuthId)) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  let user = null;

  if (password) {
    user = await prisma.user.findUnique({ where: { email } });
    if (!user || !user.password) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }
  } else if (betterAuthId) {
    const account = await prisma.account.findFirst({
      where: {
        provider: "betterauth",
        providerAccountId: betterAuthId,
      },
      include: { user: true },
    });
    if (!account || !account.user) {
      return NextResponse.json(
        { error: "Invalid BetterAuth login" },
        { status: 401 }
      );
    }
    user = account.user;
  }

  // Optionally, create a session here

  return NextResponse.json(
    { user: { ...user, password: undefined } },
    { status: 200 }
  );
}
