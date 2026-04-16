import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { getCurrentUser } from "@/lib/auth";
import { isLocale, type AppLocale } from "@/lib/i18n";

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({
  params
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) {
    return {
      title: "Tidy"
    };
  }
  return {
    title: locale === "zh" ? "Tidy 官网" : "Tidy Website",
    description: locale === "zh" ? "Tidy 企业级 AI 产品矩阵" : "Tidy enterprise AI product matrix"
  };
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }

  const localeValue = locale as AppLocale;
  const user = await getCurrentUser();

  return (
    <div>
      <SiteHeader locale={localeValue} user={user} />
      <main className="container" style={{ padding: "28px 0 44px" }}>
        {children}
      </main>
    </div>
  );
}
