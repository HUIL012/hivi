import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const userId = String(body.userId || "");
  const moduleId = String(body.moduleId || "");
  const enabled = Boolean(body.enabled);

  if (!userId || !moduleId) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const existingModule = await prisma.module.findUnique({ where: { id: moduleId } });
  if (!existingModule) {
    return NextResponse.json({ error: "Module not found" }, { status: 404 });
  }

  await prisma.previewPermission.upsert({
    where: {
      userId_moduleId: { userId, moduleId }
    },
    update: {
      enabled
    },
    create: {
      userId,
      moduleId,
      enabled
    }
  });

  return NextResponse.json({ ok: true });
}
