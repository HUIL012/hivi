"use client";

import { solutionBundles } from "../../components/site-data";
import { useAppContext } from "../../components/app-context";

export default function SolutionsPage() {
  const { language, dictionary } = useAppContext();

  return (
    <section className="section">
      <h1 className="section-title">{dictionary.solutions.title}</h1>
      <p className="section-subtitle">{dictionary.solutions.subtitle}</p>
      <div className="page-card-list">
        {solutionBundles.map((bundle) => (
          <article className="card" key={bundle.key}>
            <h3>{language === "zh" ? bundle.titleZh : bundle.titleEn}</h3>
            <p>{language === "zh" ? bundle.descZh : bundle.descEn}</p>
            <p>
              <strong>{dictionary.solutions.recommendedModules}: </strong>
              {bundle.modules.join(" + ")}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
