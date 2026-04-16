"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { productCatalog } from "../../../components/site-data";
import { useAppContext } from "../../../components/app-context";

export default function ProductDetailPage() {
  const params = useParams();
  const { dictionary, language } = useAppContext();
  const product = productCatalog.find((item) => item.slug === params.slug);

  if (!product) {
    notFound();
  }

  const isZh = language === "zh";
  const highlights = isZh ? product.zhHighlights : product.enHighlights;
  const workflow = isZh ? product.zhWorkflow : product.enWorkflow;

  return (
    <div className="section">
      <div className="detail-header">
        <div>
          <h1 className="section-title">{product.name}</h1>
          <p className="section-subtitle">{isZh ? product.zhTagline : product.enTagline}</p>
        </div>
        <Link className="button" href="/purchase">
          {dictionary.actions.tryNow}
        </Link>
      </div>

      <div className="pain-box">
        <strong>{dictionary.productDetail.painPoint}</strong>
        <p>{isZh ? product.zhPain : product.enPain}</p>
      </div>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <h2>{dictionary.productDetail.aiSolution}</h2>
        <div className="grid-2">
          {highlights.map((item) => (
            <div key={item} className="panel">
              <strong>{item}</strong>
              <p>{isZh ? "AI 界面支持截图/GIF 演示嵌入。" : "Supports screenshot/GIF AI walkthrough."}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <h2>{dictionary.productDetail.workflow}</h2>
        <div className="panel">
          {workflow.map((step, index) => (
            <p key={step}>
              {index + 1}. {step}
            </p>
          ))}
        </div>
      </section>

      <section className="section" style={{ paddingTop: "1rem" }}>
        <h2>{dictionary.productDetail.value}</h2>
        <div className="metrics">
          {product.metrics.map((metric) => (
            <div key={metric.value + metric.labelZh} className="metric">
              <strong>{metric.value}</strong>
              <span>{isZh ? metric.labelZh : metric.labelEn}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
