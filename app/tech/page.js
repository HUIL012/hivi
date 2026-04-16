"use client";

import { useAppContext } from "../../components/app-context";

export default function TechPage() {
  const { language, dictionary } = useAppContext();
  const isZh = language === "zh";

  const principles = [
    {
      titleZh: "演示即学习（Demonstration Learning）",
      titleEn: "Demonstration Learning",
      descZh:
        "用户录制一次拖拽或录入动作，AI 自动拆解界面元素、操作顺序与容错规则，生成可复用的自动化模板。",
      descEn:
        "Users record one operation, then AI decomposes UI elements, action sequence, and retry rules into reusable automation templates.",
    },
    {
      titleZh: "非侵入式执行引擎（No-API Execution）",
      titleEn: "Non-invasive No-API Engine",
      descZh:
        "通过视觉识别 + 控件语义理解，实现跨 ERP、财务、OA、老旧后台的稳定操作，无需改造原系统。",
      descEn:
        "Visual recognition and control semantics enable reliable execution across ERP, finance, OA, and legacy portals without changing source systems.",
    },
    {
      titleZh: "垂直场景知识图谱",
      titleEn: "Vertical Knowledge Graph",
      descZh:
        "将组织架构、权限、流程、绩效等管理语义标准化，确保 AI 自动化与企业治理规则一致。",
      descEn:
        "Standardized management semantics for organization, permissions, process, and KPI keep automation aligned with enterprise governance.",
    },
  ];

  return (
    <section className="section">
      <h1 className="section-title">{dictionary.tech.title}</h1>
      <p className="section-subtitle">{dictionary.tech.subtitle}</p>
      <div className="page-card-list">
        {principles.map((item) => (
          <article key={item.titleZh} className="card">
            <h3>{isZh ? item.titleZh : item.titleEn}</h3>
            <p>{isZh ? item.descZh : item.descEn}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
