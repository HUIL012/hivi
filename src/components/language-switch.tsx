"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AppLocale } from "@/lib/i18n";

export function LanguageSwitch({ locale }: { locale: AppLocale }) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const current = segments[0] === "en" ? "en" : "zh";
  const target = current === "zh" ? "en" : "zh";
  const nextPath = `/${target}/${segments.slice(1).join("/")}`;

  return (
    <Link className="lang-switch" href={nextPath === `/${target}/` ? `/${target}` : nextPath}>
      {locale === "zh" ? "English" : "中文"}
    </Link>
  );
}
