"use client";

import { useAppContext } from "../../components/app-context";

const pickLabel = (language, zh, en) => (language === "zh" ? zh : en);

export default function AboutPage() {
  const { language } = useAppContext();

  return (
    <section className="section">
      <h1 className="section-title">
        {pickLabel(language, "关于 Tidy.ai", "About Tidy.ai")}
      </h1>
      <p className="section-subtitle">
        {pickLabel(
          language,
          "Tidy.ai 是企业级无代码 AI 自动化平台，聚焦组织管理、研发协同、运营执行等垂直管理场景。",
          "Tidy.ai is an enterprise no-code AI automation platform focused on management-heavy vertical workflows."
        )}
      </p>

      <div className="page-card-list">
        <article className="card">
          <h3>{pickLabel(language, "品牌使命", "Mission")}</h3>
          <p>
            {pickLabel(
              language,
              "重塑企业生产力，让管理回归业务本身。",
              "Rebuild enterprise productivity so management can focus on business."
            )}
          </p>
        </article>
        <article className="card">
          <h3>{pickLabel(language, "技术理念", "Technology Vision")}</h3>
          <p>
            {pickLabel(
              language,
              "通过“演示即学习”与视觉识别，AI 可像员工一样在多个系统中协同执行任务。",
              "With demo-as-learning and visual recognition, AI can perform tasks like a real operator across systems."
            )}
          </p>
        </article>
        <article className="card">
          <h3>{pickLabel(language, "服务对象", "Who We Serve")}</h3>
          <p>
            {pickLabel(
              language,
              "适用于中大型企业管理层、HR、研发与运营团队。",
              "Designed for leadership teams, HR, engineering, and operations in growth-stage to enterprise companies."
            )}
          </p>
        </article>
      </div>
    </section>
  );
}
