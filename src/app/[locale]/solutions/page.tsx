import { notFound } from "next/navigation";
import { getContentSections } from "@/lib/data";
import { getDictionary, isLocale, type AppLocale } from "@/lib/i18n";

type SolutionsPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function SolutionsPage({ params }: SolutionsPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const localeValue = locale as AppLocale;
  const t = getDictionary(localeValue);
  const sections = await getContentSections(localeValue);
  const solutions = sections.find((section) => section.key === "solutions");

  return (
    <div className="stack">
      <section className="card">
        <h1 className="section-title">{t.navSolutions}</h1>
        <h3 style={{ margin: "8px 0" }}>{solutions?.title ?? t.solutionsTitle}</h3>
        <p className="muted" style={{ lineHeight: 1.7 }}>
          {solutions?.body}
        </p>
      </section>

      <section className="grid grid-3">
        <article className="card">
          <h4>HR / Organization</h4>
          <p className="muted">TidyTree.ai, TidyOrg.ai, TidyOKR.ai</p>
        </article>
        <article className="card">
          <h4>Product / Project</h4>
          <p className="muted">TidyProduct.ai, TidyKamban.ai, TidyFlows.ai</p>
        </article>
        <article className="card">
          <h4>Operations / Automation</h4>
          <p className="muted">TidyAgent.ai, TidyClaw.ai, TidyKPI.ai</p>
        </article>
      </section>
    </div>
  );
}
