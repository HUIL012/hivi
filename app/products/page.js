"use client";

import Link from "next/link";
import { productCatalog } from "../../components/site-data";
import { useAppContext } from "../../components/app-context";

export default function ProductsPage() {
  const { dictionary, language } = useAppContext();

  return (
    <section className="section">
      <h1 className="section-title">{dictionary.products.title}</h1>
      <p className="section-subtitle">{dictionary.products.subtitle}</p>
      <div className="matrix-grid">
        {productCatalog.map((product) => (
          <article className="card" key={product.slug}>
            <h3>{product.name}</h3>
            <p>{language === "zh" ? product.zhTagline : product.enTagline}</p>
            <p>{language === "zh" ? product.zhOverview : product.enOverview}</p>
            <Link href={`/products/${product.slug}`} className="button secondary">
              {dictionary.products.viewDetail}
            </Link>
          </article>
        ))}
      </div>
    </section>
  );
}
