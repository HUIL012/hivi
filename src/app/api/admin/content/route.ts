import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const payload = await request.json();
  const mode = String(payload.mode ?? "");
  const key = String(payload.key ?? "");
  const locale = String(payload.locale ?? "");
  const title = String(payload.title ?? "");
  const body = String(payload.body ?? "");

  if (!["section", "module"].includes(mode) || !key || !["zh", "en"].includes(locale)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  if (mode === "section") {
    await prisma.contentSection.upsert({
      where: { locale_key: { locale, key } },
      update: { title, body },
      create: { locale, key, title, body }
    });
    return NextResponse.json({ ok: true });
  }

  try {
    const parsed = {
      coreUse: String(payload.coreUse ?? ""),
      useCase: String(payload.useCase ?? ""),
      background: String(payload.background ?? ""),
      painPoint: String(payload.painPoint ?? ""),
      overview: String(payload.overview ?? ""),
      highlights: String(payload.highlights ?? ""),
      userHelp: String(payload.userHelp ?? ""),
      principle: String(payload.principle ?? "")
    };

    const module = await prisma.module.findUnique({ where: { slug: key } });
    if (!module) {
      return NextResponse.json({ error: "Module not found" }, { status: 404 });
    }

    await prisma.moduleNarrative.upsert({
      where: { locale_moduleId: { locale, moduleId: module.id } },
      update: {
        coreUse: parsed.coreUse,
        useCase: parsed.useCase,
        background: parsed.background,
        painPoint: parsed.painPoint,
        overview: parsed.overview,
        highlights: parsed.highlights,
        userHelp: parsed.userHelp,
        principle: parsed.principle
      },
      create: {
        locale,
        moduleId: module.id,
        coreUse: parsed.coreUse,
        useCase: parsed.useCase,
        background: parsed.background,
        painPoint: parsed.painPoint,
        overview: parsed.overview,
        highlights: parsed.highlights,
        userHelp: parsed.userHelp,
        principle: parsed.principle
      }
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Failed to save module narrative" }, { status: 400 });
  }
}
