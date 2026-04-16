"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitch } from "@/components/language-switch";
import { AuthButtons } from "@/components/auth-buttons";
import { type AppLocale, getDictionary } from "@/lib/i18n";

type SiteHeaderProps = {
  locale: AppLocale;
  user: { name: string; role: "ADMIN" | "CUSTOMER" } | null;
};

export function SiteHeader({ locale, user }: SiteHeaderProps) {
  const dict = getDictionary(locale);
  const pathname = usePathname();

  const navItems = [
    { href: `/${locale}`, label: dict.navProductMatrix },
    { href: `/${locale}#solutions`, label: dict.navSolutions },
    { href: `/${locale}#about`, label: dict.navAbout },
    { href: `/${locale}/preview`, label: dict.navPreview },
    { href: `/${locale}/principles`, label: dict.navPrinciples },
    { href: `/${locale}/modules`, label: dict.navMyModules }
  ];

  return (
    <header className="site-header">
      <div className="container site-header-inner">
        <Link className="brand" href={`/${locale}`}>
          Tidy
        </Link>
        <nav className="site-nav">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                fontWeight: pathname === item.href ? 700 : 500,
                color: pathname === item.href ? "#1d4ed8" : undefined
              }}
            >
              {item.label}
            </Link>
          ))}
          {user?.role === "ADMIN" ? (
            <Link href={`/${locale}/admin`}>
              {dict.navAdmin}
            </Link>
          ) : null}
        </nav>
        <div className="inline">
          <LanguageSwitch locale={locale} />
          <AuthButtons
            locale={locale}
            isSignedIn={Boolean(user)}
            loginLabel={dict.navLogin}
            signOutLabel={dict.navLogout}
          />
        </div>
      </div>
    </header>
  );
}
