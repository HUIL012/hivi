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
  const isLocaleHome = pathname === `/${locale}` || pathname === `/${locale}/`;

  const primaryNavItems = [
    { href: `/${locale}`, label: dict.navProductMatrix },
    { href: `/${locale}#solutions`, label: dict.navSolutions },
    { href: `/${locale}#about`, label: dict.navAbout }
  ];

  return (
    <header className={`site-header ${isLocaleHome ? "home-nav" : ""}`}>
      <div className={isLocaleHome ? "site-header-inner home-header-inner" : "container site-header-inner"}>
        <Link className={`brand ${isLocaleHome ? "home-brand-gradient" : ""}`} href={`/${locale}`}>
          TidyTree
        </Link>
        <nav className={`site-nav ${isLocaleHome ? "home-nav-links" : ""}`}>
          {primaryNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "active" : ""}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className={`inline ${isLocaleHome ? "home-nav-actions" : ""}`}>
          {!isLocaleHome ? (
            <>
              <Link className="site-nav-extra" href={`/${locale}/preview`}>
                {dict.navPreview}
              </Link>
              <Link className="site-nav-extra" href={`/${locale}/principles`}>
                {dict.navPrinciples}
              </Link>
              <Link className="site-nav-extra" href={`/${locale}/modules`}>
                {dict.navMyModules}
              </Link>
              {user?.role === "ADMIN" ? <Link className="site-nav-extra" href={`/${locale}/admin`}>{dict.navAdmin}</Link> : null}
            </>
          ) : null}
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
