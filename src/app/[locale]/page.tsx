import Link from "next/link";
import { getDictionary, isLocale, type AppLocale } from "@/lib/i18n";
import { getContentSections, getModules } from "@/lib/data";

type LocalePageProps = {
  params: Promise<{ locale: string }>;
};

export default async function LocaleHomePage({ params }: LocalePageProps) {
  const { locale: localeParam } = await params;
  const locale: AppLocale = isLocale(localeParam) ? localeParam : "zh";
  const dict = getDictionary(locale);
  const [modules, sections] = await Promise.all([
    getModules(locale),
    getContentSections(locale)
  ]);

  const sectionMap = new Map(sections.map((item) => [item.key, item]));
  const featuredModules = modules.slice(0, 3);
  const heroPrimaryTitle = locale === "zh" ? "构建你的" : "Build your";
  const heroAccentTitle = locale === "zh" ? "AI 驱动型企业" : "AI-driven enterprise";
  const heroPrimaryCta = locale === "zh" ? "立即预约演示" : "Book a demo";
  const heroSecondaryCta = locale === "zh" ? "查看技术原理" : "View technical principles";
  const productMatrixTitle = locale === "zh" ? "AI 智能产品矩阵" : "AI Product Matrix";
  const learnMoreText = locale === "zh" ? "了解详情 →" : "Learn more →";
  const iconPalette = [
    { emoji: "🤖", className: "is-cyan" },
    { emoji: "⚡", className: "is-blue" },
    { emoji: "📈", className: "is-purple" }
  ];

  return (
    <div className="home-dark-page">
      <header className="hero">
        <div className="hero-glow" />
        <div className="hero-panel">
          <h1>
            {heroPrimaryTitle}
            <br />
            <span className="hero-highlight">{heroAccentTitle}</span>
          </h1>
          <p>{sectionMap.get("hero")?.body ?? dict.heroSubtitle}</p>
          <div className="hero-actions">
            <Link className="btn btn-hero-primary" href={`/${locale}/preview`}>
              {heroPrimaryCta}
            </Link>
            <Link className="btn btn-hero-secondary" href={`/${locale}/principles`}>
              {heroSecondaryCta}
            </Link>
          </div>
        </div>
      </header>

      <section className="section" id="products">
        <h2 className="section-title home-section-title">{productMatrixTitle}</h2>
        <div className="grid grid-3">
          {featuredModules.map((module, index) => {
            const icon = iconPalette[index % iconPalette.length];
            return (
            <article key={module.id} className={`product-card ${icon.className}`}>
              <div className={`product-card-icon ${icon.className}`}>{icon.emoji}</div>
              <h3>{module.name}</h3>
              <p>{module.summary}</p>
              <Link href={`/${locale}/modules`} className={`product-card-link ${icon.className}`}>
                {learnMoreText}
              </Link>
            </article>
          );})}
        </div>
      </section>

      <section className="section" id="solutions">
        <h2 className="section-title">{dict.navSolutions}</h2>
        <div className="card">
          <h3>{sectionMap.get("solutions")?.title ?? dict.solutionsTitle}</h3>
          <p className="muted">{sectionMap.get("solutions")?.body}</p>
        </div>
      </section>

      <section className="section" id="about">
        <h2 className="section-title">{dict.navAbout}</h2>
        <div className="card">
          <h3>{sectionMap.get("about")?.title ?? dict.aboutTitle}</h3>
          <p className="muted">{sectionMap.get("about")?.body}</p>
          <h3>{sectionMap.get("core-commonality")?.title ?? dict.commonCoreTitle}</h3>
          <p className="muted">{sectionMap.get("core-commonality")?.body}</p>
        </div>
      </section>
      <footer className="home-footer">© 2026 TidyTree.ai All rights reserved.</footer>
    </div>
  );
}
