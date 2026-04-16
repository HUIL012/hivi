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

  return (
    <>
      <section className="hero">
        <h1>{dict.heroTitle}</h1>
        <p>{sectionMap.get("hero")?.body ?? dict.heroSubtitle}</p>
      </section>

      <section className="section" id="products">
        <h2 className="section-title">{dict.navProductMatrix}</h2>
        <div className="grid grid-3">
          {modules.map((module) => (
            <article key={module.id} className="card">
              <h3 style={{ marginTop: 0 }}>{module.name}</h3>
              <p className="muted">{module.summary}</p>
              <p>
                <strong>{dict.sectionCoreUse}:</strong> {module.coreUse}
              </p>
              <p>
                <strong>{dict.sectionUseCase}:</strong> {module.useCase}
              </p>
              <p>
                <strong>{dict.sectionBackground}:</strong> {module.background}
              </p>
              <p>
                <strong>{dict.sectionPainPoint}:</strong> {module.painPoint}
              </p>
              <p>
                <strong>{dict.sectionOverview}:</strong> {module.overview}
              </p>
              <p>
                <strong>{dict.sectionHighlights}:</strong> {module.highlights}
              </p>
              <p>
                <strong>{dict.sectionValue}:</strong> {module.value}
              </p>
            </article>
          ))}
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
    </>
  );
}
