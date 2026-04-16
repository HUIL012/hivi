import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type CreateOrderPayload = {
  userId?: string;
  moduleIds?: string[];
  status?: string;
};

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user || user.role !== Role.ADMIN) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = (await request.json()) as CreateOrderPayload;
  const moduleIds = [...new Set(payload.moduleIds ?? [])];

  if (!payload.userId || moduleIds.length === 0) {
    return NextResponse.json(
      { error: "userId and moduleIds are required" },
      { status: 400 }
    );
  }

  const modules = await prisma.module.findMany({
    where: { id: { in: moduleIds } }
  });

  if (modules.length !== moduleIds.length) {
    return NextResponse.json({ error: "Some modules were not found" }, { status: 400 });
  }

  const now = Date.now();
  const orderNo = `TT-${new Date().getFullYear()}-${String(now).slice(-6)}`;
  const totalCents = modules.reduce((sum, module) => sum + module.priceCents, 0);

  const order = await prisma.order.create({
    data: {
      userId: payload.userId,
      orderNo,
      status: payload.status || "PAID",
      totalCents,
      items: {
        create: modules.map((module) => ({
          moduleId: module.id,
          quantity: 1,
          priceCents: module.priceCents
        }))
      }
    }
  });

  return NextResponse.json({ order });
}
