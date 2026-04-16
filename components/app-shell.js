"use client";

import Link from "next/link";
import { useAppContext } from "./app-context";

export function AppShell({ children }) {
  const { language, toggleLanguage, dictionary, isLoggedIn, logout } = useAppContext();

  return (
    <div className="site-shell">
      <header className="navbar">
        <div className="brand">
          <span className="brand-title">{dictionary.nav.brandTitle}</span>
          <span className="brand-slogan">{dictionary.nav.slogan}</span>
        </div>
        <nav className="menu">
          <Link href="/">Home</Link>
          <Link href="/products">{dictionary.nav.productMatrix}</Link>
          <Link href="/solutions">{dictionary.nav.solutions}</Link>
          <Link href="/about">{dictionary.nav.about}</Link>
          <Link href="/tech">{dictionary.nav.tech}</Link>
          <Link href="/purchase">{dictionary.nav.purchase}</Link>
          <Link href="/admin">{dictionary.nav.admin}</Link>
          {isLoggedIn ? (
            <button type="button" className="language-switch" onClick={logout}>
              {dictionary.nav.logout}
            </button>
          ) : (
            <Link href="/login" className="cta-link">
              {dictionary.nav.login}
            </Link>
          )}
          <button type="button" className="language-switch" onClick={toggleLanguage}>
            {language === "zh" ? "EN" : "中文"}
          </button>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="footer">© 2026 Tidy.ai · TidyTree.ai</footer>
    </div>
  );
}
