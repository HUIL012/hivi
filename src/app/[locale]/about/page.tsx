import { notFound } from "next/navigation";
import { getContentSections } from "@/lib/data";
import { getDictionary, isLocale } from "@/lib/i18n";

type AboutPageProps = {
  params: Promise<{ locale: string }>;
};

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  const t = getDictionary(locale);
  const sections = await getContentSections(locale);
  const about = sections.find((s) => s.key === "about");
  const common = sections.find((s) => s.key === "core-commonality");

  return (
    <div className="stack">
      <section className="card">
        <h1 className="section-title">{t.navAbout}</h1>
        <p className="muted">{about?.body ?? t.aboutBody}</p>
      </section>

      <section className="card">
        <h2 className="section-title" style={{ fontSize: 24 }}>
          {t.commonCoreTitle}
        </h2>
        <p className="muted">{common?.body}</p>
        <ul>
          <li>{t.coreBullet1}</li>
          <li>{t.coreBullet2}</li>
          <li>{t.coreBullet3}</li>
        </ul>
      </section>
    </div>
  );
}
