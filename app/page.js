"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useAppContext } from "../components/app-context";
import { productCatalog, solutionBundles } from "../components/site-data";

function pickLabel(language, zh, en) {
  return language === "zh" ? zh : en;
}

export default function HomePage() {
  const { language, dictionary, content } = useAppContext();
  const [progress, setProgress] = useState(0);
  const [quizState, setQuizState] = useState({ size: "50-200", pain: "org" });

  const heroData = content[language];
  const displayProducts = productCatalog.slice(0, 9);

  const quizSuggestion = useMemo(() => {
    const isOrgPain = quizState.pain === "org";
    const isOpsPain = quizState.pain === "ops";
    const isMidLarge = quizState.size !== "1-50";

    if (isOrgPain && isMidLarge) {
      return language === "zh"
        ? "推荐：TidyTree + TidyOrg + TidyKPI（组织管理闭环）"
        : "Recommended: TidyTree + TidyOrg + TidyKPI (Org management loop)";
    }
    if (isOpsPain) {
      return language === "zh"
        ? "推荐：TidyFlows + TidyClaw（跨系统自动化）"
        : "Recommended: TidyFlows + TidyClaw (Cross-system automation)";
    }
    return language === "zh"
      ? "推荐：TidyKanban + TidyProduct + TidyAgent（研发提效）"
      : "Recommended: TidyKanban + TidyProduct + TidyAgent (R&D acceleration)";
  }, [quizState, language]);

  const handleDemo = () => {
    setProgress(20);
    setTimeout(() => setProgress(55), 350);
    setTimeout(() => setProgress(85), 800);
    setTimeout(() => setProgress(100), 1200);
  };

  return (
    <>
      <section className="section hero">
        <div>
          <h1>{heroData.heroTitle}</h1>
          <p>{heroData.heroSubtitle}</p>
          <p>
            {pickLabel(
              language,
              "连接、分析、自动化 —— 构建你的企业智能大脑。",
              "Connect, analyze, automate — build your enterprise AI brain."
            )}
          </p>
          <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
            <Link href="/products/tidytree" className="button">
              {dictionary.home.tryNow}
            </Link>
            <Link href="/tech" className="button secondary">
              {dictionary.home.viewTech}
            </Link>
          </div>
        </div>
        <div className="dynamic-board">
          <div className="flow-item">
            {pickLabel(
              language,
              "AI 正在读取组织调整申请…",
              "AI is reading re-org change requests..."
            )}
          </div>
          <div className="flow-item">
            {pickLabel(
              language,
              "自动更新权限组与系统角色…",
              "Auto-updating permission groups and roles..."
            )}
          </div>
          <div className="flow-item">
            {pickLabel(
              language,
              "已同步汇报链与审批路径。",
              "Reporting chains and approval paths synchronized."
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{dictionary.home.matrixTitle}</h2>
        <p className="section-subtitle">{dictionary.home.matrixSubtitle}</p>
        <div className="matrix-grid">
          {displayProducts.map((item) => (
            <Link key={item.slug} href={`/products/${item.slug}`} className="card">
              <h3>{item.name}</h3>
              <p>{pickLabel(language, item.zhTagline, item.enTagline)}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{dictionary.home.capabilityTitle}</h2>
        <div className="capabilities">
          {dictionary.home.capabilities.map((capability) => (
            <article key={capability.title} className="capability">
              <h3>{capability.title}</h3>
              <p>{capability.desc}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section grid-2">
        <div className="demo-box">
          <h3>{dictionary.home.demoTitle}</h3>
          <p>{dictionary.home.demoDesc}</p>
          <button type="button" className="button" onClick={handleDemo}>
            {dictionary.home.startRecording}
          </button>
          <div className="demo-track">
            <div className="demo-progress" style={{ width: `${progress}%` }} />
          </div>
          <p>
            {progress === 100
              ? dictionary.home.aiLearned
              : pickLabel(language, "等待录制动作…", "Waiting for demonstration...")}
          </p>
        </div>

        <div className="quiz-box">
          <h3>{dictionary.home.quizTitle}</h3>
          <label>
            {pickLabel(language, "你的团队有多少人？", "How many people in your team?")}
            <select
              value={quizState.size}
              onChange={(event) =>
                setQuizState((previous) => ({ ...previous, size: event.target.value }))
              }
            >
              <option value="1-50">1-50</option>
              <option value="50-200">50-200</option>
              <option value="200+">200+</option>
            </select>
          </label>
          <label>
            {pickLabel(language, "最头疼的业务是什么？", "What is your biggest pain point?")}
            <select
              value={quizState.pain}
              onChange={(event) =>
                setQuizState((previous) => ({ ...previous, pain: event.target.value }))
              }
            >
              <option value="org">{pickLabel(language, "组织管理", "Org management")}</option>
              <option value="rd">{pickLabel(language, "研发交付", "R&D delivery")}</option>
              <option value="ops">{pickLabel(language, "运营执行", "Operations")}</option>
            </select>
          </label>
          <p>{quizSuggestion}</p>
        </div>
      </section>

      <section className="section compare-box">
        <h2 className="section-title">{dictionary.home.compareTitle}</h2>
        <table>
          <thead>
            <tr>
              <th>{pickLabel(language, "维度", "Dimension")}</th>
              <th>{pickLabel(language, "传统 SaaS", "Traditional SaaS")}</th>
              <th>{pickLabel(language, "Tidy AI 系统", "Tidy AI System")}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{pickLabel(language, "系统打通", "Integration")}</td>
              <td>{pickLabel(language, "需接口对接", "API integration required")}</td>
              <td>{pickLabel(language, "无需 API，视觉学习", "No API, visual learning")}</td>
            </tr>
            <tr>
              <td>{pickLabel(language, "维护方式", "Maintenance")}</td>
              <td>{pickLabel(language, "人工维护规则", "Manual maintenance")}</td>
              <td>{pickLabel(language, "AI 自动维护", "AI self-maintenance")}</td>
            </tr>
            <tr>
              <td>{pickLabel(language, "场景匹配", "Vertical fit")}</td>
              <td>{pickLabel(language, "通用流程", "Generic workflow")}</td>
              <td>{pickLabel(language, "管理场景深度优化", "Deep management optimization")}</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="section">
        <h2 className="section-title">{dictionary.home.solutionTitle}</h2>
        <div className="page-card-list">
          {solutionBundles.map((bundle) => (
            <article key={bundle.key} className="card">
              <h3>{pickLabel(language, bundle.titleZh, bundle.titleEn)}</h3>
              <p>{pickLabel(language, bundle.descZh, bundle.descEn)}</p>
              <p>{bundle.modules.join(" + ")}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">{dictionary.home.trustTitle}</h2>
        <div className="logo-row">
          {["Northwind", "BrightData", "ByteFactory", "Helix Medical", "CloudForge"].map((logo) => (
            <span className="logo-item" key={logo}>
              {logo}
            </span>
          ))}
        </div>
        <div className="faq-list" style={{ marginTop: "1rem" }}>
          <article className="card">
            <h3>{pickLabel(language, "无需 API 真的可行吗？", "Does no-API mode really work?")}</h3>
            <p>
              {pickLabel(
                language,
                "TidyClaw 与 TidyTree 采用视觉识别与演示学习，适配老旧系统与现代系统。",
                "TidyClaw and TidyTree use visual recognition and demo learning for both legacy and modern systems."
              )}
            </p>
          </article>
          <article className="card">
            <h3>{pickLabel(language, "上线周期多长？", "How long to launch?")}</h3>
            <p>
              {pickLabel(
                language,
                "通常 1-2 周可完成关键流程落地，具体取决于模块数量与系统复杂度。",
                "Most teams launch key flows within 1-2 weeks depending on modules and system complexity."
              )}
            </p>
          </article>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <Link href="/purchase" className="button">
            {dictionary.home.requestTrial}
          </Link>
        </div>
      </section>
    </>
  );
}
