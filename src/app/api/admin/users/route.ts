import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const userId = String(body.userId || "").trim();
  const role = String(body.role || "").toUpperCase();

  if (!userId || (role !== "ADMIN" && role !== "CUSTOMER")) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: role as Role }
  });

  return NextResponse.json({ ok: true, user: updated });
}
