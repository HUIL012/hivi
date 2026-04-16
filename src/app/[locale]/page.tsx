import Link from "next/link";
import { getDictionary, isLocale, type AppLocale } from "@/lib/i18n";
import { formatCurrency, getContentSections, getModules } from "@/lib/data";

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
  const heroPrimaryTitle =
    locale === "zh" ? "构建你的" : "Build Your";
  const heroAccentTitle =
    locale === "zh" ? "AI 驱动型企业" : "AI-Driven Enterprise";
  const heroPrimaryCta = locale === "zh" ? "立即预约演示" : "Book a Demo";
  const heroSecondaryCta =
    locale === "zh" ? "查看技术原理" : "View Technical Principles";
  const learnMoreText = locale === "zh" ? "了解详情 →" : "Learn more →";

  return (
    <>
      <section className="home-dark-shell">
        <div className="home-dark-hero card">
          <h1 className="home-dark-title">
            {heroPrimaryTitle}
            <br />
            <span>{heroAccentTitle}</span>
          </h1>
          <p className="home-dark-subtitle">{sectionMap.get("hero")?.body ?? dict.heroSubtitle}</p>
          <div className="hero-actions">
            <Link className="btn btn-light" href={`/${locale}/preview`}>
              {heroPrimaryCta}
            </Link>
            <Link className="btn btn-dark-outline" href={`/${locale}/principles`}>
              {heroSecondaryCta}
            </Link>
          </div>
        </div>
      </section>

      <section className="section home-dark-shell" id="products">
        <h2 className="section-title home-dark-heading">{locale === "zh" ? "AI 智能产品矩阵" : "AI Product Matrix"}</h2>
        <div className="grid grid-3">
          {featuredModules.map((module) => (
            <article key={module.id} className="home-dark-card">
              <div className="home-dark-card-icon">{module.name.charAt(4) || "AI"}</div>
              <h3>{module.name}</h3>
              <p>{module.summary}</p>
              <Link href={`/${locale}/modules`} className="home-dark-link">
                {learnMoreText}
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section" id="solutions">
        <h2 className="section-title">{dict.navSolutions}</h2>
        <div className="card">
          <h3>{sectionMap.get("solutions")?.title ?? dict.solutionsTitle}</h3>
          <p className="muted">{sectionMap.get("solutions")?.body}</p>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{dict.pricingTitle}</h2>
        <p className="muted">{dict.pricingSubtitle}</p>
        <div className="grid grid-3">
          {modules.map((module) => (
            <article key={`price-${module.id}`} className="card">
              <h3 style={{ marginTop: 0 }}>{module.name}</h3>
              <p className="muted">{module.summary}</p>
              <p style={{ fontSize: 24, fontWeight: 700 }}>
                {formatCurrency(module.priceCents, locale)}
              </p>
              <Link className="btn btn-primary" href={`/${locale}/login`}>
                {dict.buyModule}
              </Link>
            </article>
          ))}
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
    </>
  );
}
