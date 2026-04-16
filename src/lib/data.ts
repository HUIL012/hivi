import { prisma } from "@/lib/prisma";
import { type AppLocale, defaultLocale } from "@/lib/i18n";

export function formatCurrency(cents: number, locale: AppLocale) {
  return new Intl.NumberFormat(locale === "zh" ? "zh-CN" : "en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(cents / 100);
}

export async function getModules(locale: AppLocale) {
  const [modules, narratives] = await Promise.all([
    prisma.module.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" }
    }),
    prisma.moduleNarrative.findMany({
      where: { locale },
      orderBy: { moduleId: "asc" }
    })
  ]);

  const narrativeMap = new Map(narratives.map((item) => [item.moduleId, item]));

  return modules.map((module) => {
    const narrative = narrativeMap.get(module.id);
    return {
      id: module.id,
      slug: module.slug,
      name: locale === "zh" ? module.nameZh : module.nameEn,
      summary: locale === "zh" ? module.summaryZh : module.summaryEn,
      coreUse: narrative?.coreUse ?? "",
      useCase: narrative?.useCase ?? "",
      background: narrative?.background ?? "",
      painPoint: narrative?.painPoint ?? "",
      overview: narrative?.overview ?? "",
      highlights: narrative?.highlights ?? "",
      value: narrative?.userHelp ?? "",
      principle: narrative?.principle ?? "",
      priceCents: module.priceCents
    };
  });
}

export async function getContentSections(locale: AppLocale) {
  const sections = await prisma.contentSection.findMany({
    where: { locale },
    orderBy: { key: "asc" }
  });

  if (sections.length > 0 || locale === defaultLocale) {
    return sections;
  }

  return prisma.contentSection.findMany({
    where: { locale: defaultLocale },
    orderBy: { key: "asc" }
  });
}

export async function getDashboardData(userId: string, locale: AppLocale) {
  const [orders, permissions, modules] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: { module: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.previewPermission.findMany({
      where: { userId },
      include: { module: true },
      orderBy: { module: { createdAt: "asc" } }
    }),
    prisma.module.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" }
    })
  ]);

  const purchasedModulesMap = new Map<
    string,
    { slug: string; name: string; summary: string; priceLabel: string }
  >();
  for (const order of orders) {
    for (const item of order.items) {
      purchasedModulesMap.set(item.module.slug, {
        slug: item.module.slug,
        name: locale === "zh" ? item.module.nameZh : item.module.nameEn,
        summary: locale === "zh" ? item.module.summaryZh : item.module.summaryEn,
        priceLabel: formatCurrency(item.priceCents, locale)
      });
    }
  }

  const previewPermissions = modules.map((module) => {
    const permission = permissions.find((item) => item.moduleId === module.id);
    return {
      moduleId: module.id,
      moduleSlug: module.slug,
      moduleName: locale === "zh" ? module.nameZh : module.nameEn,
      enabled: permission?.enabled ?? false
    };
  });

  return {
    orders,
    purchasedModules: Array.from(purchasedModulesMap.values()),
    previewPermissions
  };
}

export async function getPreviewPermissionsByUser(userId: string) {
  return prisma.previewPermission.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" }
  });
}

export async function getAdminData() {
  const [users, orders, moduleNarratives, sections, permissions, modules] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" }
    }),
    prisma.order.findMany({
      include: {
        user: true,
        items: {
          include: { module: true }
        }
      },
      orderBy: { createdAt: "desc" }
    }),
    prisma.moduleNarrative.findMany({
      include: { module: true },
      orderBy: [{ locale: "asc" }, { moduleId: "asc" }]
    }),
    prisma.contentSection.findMany({
      orderBy: [{ locale: "asc" }, { key: "asc" }]
    }),
    prisma.previewPermission.findMany({
      include: { user: true, module: true },
      orderBy: { updatedAt: "desc" }
    }),
    prisma.module.findMany({
      where: { active: true },
      orderBy: { createdAt: "asc" }
    })
  ]);

  return { users, orders, moduleNarratives, sections, permissions, modules };
}
