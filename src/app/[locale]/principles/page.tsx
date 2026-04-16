import { getDictionary, type AppLocale } from "@/lib/i18n";
import { getModules } from "@/lib/data";
import { requireLocale } from "@/lib/session";

type PrinciplesPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function PrinciplesPage({ params }: PrinciplesPageProps) {
  const { locale: localeParam } = await params;
  const locale: AppLocale = requireLocale(localeParam);
  const dict = getDictionary(locale);
  const modules = await getModules(locale);

  return (
    <main className="container" style={{ padding: "28px 0 40px" }}>
      <section className="card" style={{ marginBottom: 16 }}>
        <h1 className="section-title" style={{ marginBottom: 8 }}>
          {dict.techPrinciplesTitle}
        </h1>
        <p className="muted">{dict.techPrinciplesIntro}</p>
      </section>

      <section className="grid grid-3">
        {modules.map((module) => (
          <article key={module.id} className="card">
            <h3 style={{ margin: "0 0 8px" }}>{module.name}</h3>
            <p className="muted" style={{ marginTop: 0 }}>
              {module.summary}
            </p>
            <p style={{ marginBottom: 0 }}>{module.principle}</p>
          </article>
        ))}
      </section>
    </main>
  );
}
