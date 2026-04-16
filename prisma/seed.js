const { PrismaClient, Role } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const bcrypt = require("bcryptjs");

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL || "file:./prisma/dev.db"
});
const prisma = new PrismaClient({ adapter });

const moduleDefinitions = [
  {
    slug: "tidytree-ai",
    nameZh: "TidyTree.ai",
    nameEn: "TidyTree.ai",
    summaryZh: "组织架构 / 层级管理 AI。",
    summaryEn: "AI for org hierarchy and structure governance.",
    priceCents: 129900
  },
  {
    slug: "tidyagent-ai",
    nameZh: "TidyAgent.ai",
    nameEn: "TidyAgent.ai",
    summaryZh: "通用 AI 智能体引擎。",
    summaryEn: "General no-code AI agent engine.",
    priceCents: 99900
  },
  {
    slug: "tidyclaw-ai",
    nameZh: "TidyClaw.ai",
    nameEn: "TidyClaw.ai",
    summaryZh: "自动化操作 / 工具执行 AI。",
    summaryEn: "Executable AI for tool and system operations.",
    priceCents: 159900
  },
  {
    slug: "tidyproduct-ai",
    nameZh: "TidyProduct.ai",
    nameEn: "TidyProduct.ai",
    summaryZh: "产品全生命周期管理 AI。",
    summaryEn: "AI for end-to-end product lifecycle management.",
    priceCents: 89900
  },
  {
    slug: "tidyflows-ai",
    nameZh: "TidyFlows.ai",
    nameEn: "TidyFlows.ai",
    summaryZh: "企业工作流自动化 AI。",
    summaryEn: "AI for enterprise workflow automation.",
    priceCents: 109900
  },
  {
    slug: "tidykpi-ai",
    nameZh: "TidyKPI.ai",
    nameEn: "TidyKPI.ai",
    summaryZh: "KPI 管理与分析 AI。",
    summaryEn: "AI for KPI tracking and analytics.",
    priceCents: 95900
  },
  {
    slug: "tidykamban-ai",
    nameZh: "TidyKamban.ai",
    nameEn: "TidyKamban.ai",
    summaryZh: "看板 / 敏捷项目管理 AI。",
    summaryEn: "AI for Kanban and agile project delivery.",
    priceCents: 85900
  },
  {
    slug: "tidyokr-ai",
    nameZh: "TidyOKR.ai",
    nameEn: "TidyOKR.ai",
    summaryZh: "OKR 管理 AI。",
    summaryEn: "AI for end-to-end OKR management.",
    priceCents: 89900
  },
  {
    slug: "tidyorg-ai",
    nameZh: "TidyOrg.ai",
    nameEn: "TidyOrg.ai",
    summaryZh: "企业级组织管理综合 AI。",
    summaryEn: "Comprehensive AI for enterprise organization management.",
    priceCents: 149900
  }
];

const moduleNarratives = [
  {
    slug: "tidytree-ai",
    locale: "zh",
    coreUse:
      "组织架构 / 层级管理 AI。自动维护层级关系、汇报链路，智能优化组织分工，辅助组织架构调整决策。",
    useCase: "企业组织架构梳理、部门权责划分、层级关系可视化。",
    background: "企业组织规模增长后，组织架构与汇报链路维护复杂度快速上升。",
    painPoint: "组织变化同步滞后、职责边界模糊、跨部门协作链路难以量化。",
    overview: "通过可视化组织树、汇报链路自动校验和组织效能分析，建立可持续的组织治理能力。",
    highlights: "组织树实时更新；汇报链路校验；组织调整影响分析；分工优化建议。",
    userHelp: "帮助管理层与 HR 以数据方式优化组织设计，降低沟通成本并提升组织效能。",
    principle: "基于关系图建模与规则引擎，结合 AI 推理识别组织冲突与潜在优化路径。"
  },
  {
    slug: "tidyagent-ai",
    locale: "zh",
    coreUse: "通用 AI 智能体引擎。无代码搭建和训练专属助手，替代人工执行重复任务。",
    useCase: "个人 / 团队通用自动化助手，自定义业务流程机器人。",
    background: "企业存在大量跨系统、规则明确但重复耗时的任务。",
    painPoint: "人工执行效率低且易出错，自动化开发成本高、上线慢。",
    overview: "通过无代码智能体编排，让业务人员也能快速搭建自动化执行助手。",
    highlights: "无代码搭建；任务编排；知识注入；模板复用。",
    userHelp: "释放重复劳动，提升执行一致性与组织整体效率。",
    principle: "通过任务意图解析 + 工具调用编排，实现从自然语言到执行动作的闭环。"
  },
  {
    slug: "tidyclaw-ai",
    locale: "zh",
    coreUse: "自动化操作 / 工具执行 AI。通过视觉识别学习软件与网页操作，无需 API 对接。",
    useCase: "无 API 老旧系统自动化、跨软件流程批处理、桌面操作自动化。",
    background: "大量关键业务系统无法提供稳定 API，导致自动化受阻。",
    painPoint: "跨系统流程依赖人工串联，重复操作耗时且一致性差。",
    overview: "通过视觉感知和动作学习让 AI 直接执行界面操作，完成端到端任务。",
    highlights: "视觉学习；跨平台执行；复杂流程批量处理；无需 API。",
    userHelp: "帮助企业低成本打通系统孤岛，加速自动化改造落地。",
    principle: "结合界面元素识别、操作轨迹记忆与自恢复机制，提升执行稳定性。"
  },
  {
    slug: "tidyproduct-ai",
    locale: "zh",
    coreUse:
      "产品管理 AI。覆盖需求收集、PRD 撰写、反馈分析、Roadmap 规划与优先级推荐。",
    useCase: "互联网产品团队、产品经理日常工作辅助。",
    background: "产品团队在需求、文档、反馈、计划之间频繁切换，信息分散。",
    painPoint: "优先级争议高、复盘效率低、文档产出压力大。",
    overview: "统一产品全生命周期数据，提供 AI 辅助决策和文档自动化。",
    highlights: "需求聚类；PRD 草拟；竞品分析；迭代优先级建议。",
    userHelp: "提升产品决策质量，缩短需求到上线周期。",
    principle: "融合结构化产品数据与语义分析模型，实现上下文感知的产品决策辅助。"
  },
  {
    slug: "tidyflows-ai",
    locale: "zh",
    coreUse: "工作流自动化 AI。可视化搭建并自动执行业务流程，智能优化流程节点。",
    useCase: "企业流程数字化、跨部门协作流程自动化。",
    background: "业务流程跨部门协作复杂，人工推进导致效率与透明度不足。",
    painPoint: "流程阻塞难发现、重复审批多、异常处理不及时。",
    overview: "提供流程建模、自动执行、监控与优化闭环。",
    highlights: "拖拽建模；节点优化建议；自动催办；效率看板。",
    userHelp: "帮助企业降低流程摩擦，提升跨部门协同效率。",
    principle: "基于流程图状态机与策略引擎，结合 AI 分析持续优化路径。"
  },
  {
    slug: "tidykpi-ai",
    locale: "zh",
    coreUse: "KPI 管理与分析 AI。自动采集多源数据、异常预警并生成绩效报表。",
    useCase: "企业绩效管理、业务数据监控、部门 KPI 考核。",
    background: "企业 KPI 数据分散，实时追踪和统一分析难度高。",
    painPoint: "指标口径不统一、异常发现滞后、报表制作成本高。",
    overview: "统一 KPI 数据链路，提供监控、诊断和优化建议。",
    highlights: "多源采集；异常预警；趋势分析；自动报表。",
    userHelp: "帮助管理层快速定位业务问题并及时调整经营策略。",
    principle: "采用指标语义映射 + 异常检测模型，构建统一 KPI 监控中枢。"
  },
  {
    slug: "tidykamban-ai",
    locale: "zh",
    coreUse: "看板 / 敏捷项目管理 AI。自动分配任务、预测工期、识别风险并优化排期。",
    useCase: "研发团队敏捷管理、项目任务看板、研发流程优化。",
    background: "项目执行中任务分配、排期和风险判断依赖经验，缺乏数据支撑。",
    painPoint: "项目延期风险难提前识别，团队负载不均衡。",
    overview: "将 AI 深度融入看板流程，辅助任务管理和项目交付预测。",
    highlights: "智能任务分配；工期预测；风险预警；敏捷节奏建议。",
    userHelp: "提升项目交付稳定性、可预测性和团队协同效率。",
    principle: "利用历史任务数据建模与依赖关系分析实现动态排期优化。"
  },
  {
    slug: "tidyokr-ai",
    locale: "zh",
    coreUse: "OKR 管理 AI。覆盖目标制定对齐、进度跟踪、完成度分析和智能复盘。",
    useCase: "企业 OKR 落地、团队目标对齐、目标执行跟踪。",
    background: "OKR 推进常出现目标对齐不足和执行跟踪断层。",
    painPoint: "目标拆解不清晰、进度更新滞后、复盘质量不稳定。",
    overview: "支持 OKR 全流程管理并自动生成目标执行报告。",
    highlights: "目标对齐检测；进度自动跟踪；完成度分析；报告自动生成。",
    userHelp: "帮助企业建立高质量目标闭环并提升战略执行力。",
    principle: "通过目标树建模与执行证据聚合实现可追踪的 OKR 管理闭环。"
  },
  {
    slug: "tidyorg-ai",
    locale: "zh",
    coreUse: "组织管理 AI。整合组织、人力、流程、绩效数据，辅助组织效能与人员配置决策。",
    useCase: "企业 HR、管理层组织管理与决策辅助。",
    background: "组织管理决策依赖多源数据，但系统之间数据割裂严重。",
    painPoint: "组织效能难量化、人员配置依据不足、决策响应慢。",
    overview: "提供组织效能分析、人员配置建议与决策模拟能力。",
    highlights: "组织健康监控；效能分析；配置优化建议；场景模拟。",
    userHelp: "帮助企业持续优化组织结构与资源配置，提升整体运营效率。",
    principle: "融合组织图谱、绩效模型与流程数据，形成组织决策智能中枢。"
  },
  {
    slug: "tidytree-ai",
    locale: "en",
    coreUse:
      "AI for organizational hierarchy and reporting lines, with intelligent role allocation and structure optimization.",
    useCase: "Organization mapping, department responsibility design, and hierarchy visualization.",
    background: "As organizations scale, maintaining hierarchy and reporting lines grows increasingly complex.",
    painPoint: "Slow org updates, unclear ownership boundaries, and weak cross-team visibility.",
    overview: "Build sustainable org governance through visual trees, validation, and efficiency analytics.",
    highlights: "Live org updates; reporting validation; impact simulation; structure optimization guidance.",
    userHelp: "Helps leaders and HR optimize org design with data-driven decisions.",
    principle: "Combines graph-based org modeling, rule engines, and AI reasoning."
  },
  {
    slug: "tidyagent-ai",
    locale: "en",
    coreUse:
      "General-purpose no-code AI agent engine for building dedicated assistants and automating repetitive tasks.",
    useCase: "Personal/team automation assistants and custom workflow bots.",
    background: "Organizations run many repetitive cross-system operations daily.",
    painPoint: "Manual execution is slow and error-prone, while classic automation is costly.",
    overview: "Enable non-technical teams to build and run AI assistants via no-code orchestration.",
    highlights: "No-code builder; orchestration; knowledge injection; reusable templates.",
    userHelp: "Reduces repetitive manual work and improves execution consistency.",
    principle: "Turns natural-language intents into executable actions via tool orchestration."
  },
  {
    slug: "tidyclaw-ai",
    locale: "en",
    coreUse:
      "Executable AI for software/web operation learning via vision, without API integrations.",
    useCase: "Legacy-system automation, cross-tool batch workflows, and desktop automation.",
    background: "Many critical systems do not provide stable APIs for integrations.",
    painPoint: "Cross-system workflows rely on manual handoffs and repetitive UI work.",
    overview: "Uses visual perception and action learning to execute UI operations end-to-end.",
    highlights: "Visual learning; cross-platform runs; batch execution; API-free automation.",
    userHelp: "Helps enterprises accelerate automation across disconnected systems.",
    principle: "Combines UI element detection, action memory, and self-recovery."
  },
  {
    slug: "tidyproduct-ai",
    locale: "en",
    coreUse:
      "Product management AI for requirements, PRD drafting, feedback analytics, roadmap planning, and prioritization.",
    useCase: "Daily support for internet product teams and product managers.",
    background: "Product teams constantly switch across fragmented contexts.",
    painPoint: "Prioritization conflicts, low retrospective efficiency, and doc pressure.",
    overview: "Unifies lifecycle data and adds AI decision support and documentation automation.",
    highlights: "Requirement clustering; PRD drafting; competitor analysis; sprint prioritization.",
    userHelp: "Improves product decision quality and shortens delivery cycles.",
    principle: "Combines structured product data and semantic analysis for PM assistance."
  },
  {
    slug: "tidyflows-ai",
    locale: "en",
    coreUse:
      "Workflow automation AI for visual process building, execution, and node-level optimization.",
    useCase: "Enterprise process digitization and cross-team workflow automation.",
    background: "Cross-team processes are complex and inefficient when coordinated manually.",
    painPoint: "Hidden bottlenecks, repeated approvals, and delayed exception handling.",
    overview: "Delivers process modeling, automated execution, monitoring, and optimization.",
    highlights: "Drag-and-drop modeling; optimization suggestions; auto-reminders; dashboards.",
    userHelp: "Reduces process friction and improves cross-department efficiency.",
    principle: "Uses workflow state machines and policy engines with AI analytics."
  },
  {
    slug: "tidykpi-ai",
    locale: "en",
    coreUse:
      "KPI management and analytics AI for data ingestion, anomaly alerts, and performance reporting.",
    useCase: "Performance management, business monitoring, and KPI evaluation.",
    background: "KPI data is fragmented across systems, limiting real-time visibility.",
    painPoint: "Inconsistent definitions, delayed anomaly detection, and high reporting effort.",
    overview: "Unifies KPI pipelines for monitoring, diagnostics, and optimization insights.",
    highlights: "Multi-source ingestion; anomaly alerts; trend analysis; auto reports.",
    userHelp: "Helps management respond faster and improve strategy execution.",
    principle: "Uses metric semantic mapping and anomaly detection models."
  },
  {
    slug: "tidykamban-ai",
    locale: "en",
    coreUse:
      "AI-enhanced Kanban and agile project management for assignment, schedule prediction, and risk detection.",
    useCase: "Agile management for R&D teams and project delivery optimization.",
    background: "Planning and risk control often depend on manual judgement.",
    painPoint: "Late risk detection and uneven workload distribution.",
    overview: "Embeds AI into Kanban for smarter assignment and delivery forecasting.",
    highlights: "Smart assignment; timeline prediction; risk alerts; cadence recommendations.",
    userHelp: "Improves delivery predictability and team collaboration.",
    principle: "Applies historical task modeling and dependency analysis."
  },
  {
    slug: "tidyokr-ai",
    locale: "en",
    coreUse:
      "OKR management AI for alignment, progress tracking, completion analytics, and retrospectives.",
    useCase: "OKR rollout, team alignment, and objective execution tracking.",
    background: "Organizations often struggle with OKR alignment and continuity.",
    painPoint: "Unclear decomposition, delayed updates, and weak retrospectives.",
    overview: "Supports full-cycle OKR management with automated reporting.",
    highlights: "Alignment checks; progress tracking; completion analytics; auto reports.",
    userHelp: "Builds a reliable objective-execution loop and improves strategic execution.",
    principle: "Uses goal-tree modeling and evidence aggregation."
  },
  {
    slug: "tidyorg-ai",
    locale: "en",
    coreUse:
      "Enterprise organization management AI integrating HR, process, and performance data for org decisions.",
    useCase: "Organization management and workforce decision support for HR and leadership.",
    background: "Organization decisions require multi-source data, but systems are siloed.",
    painPoint: "Low quantifiability of org efficiency and slow staffing decisions.",
    overview: "Provides efficiency analytics, staffing recommendations, and scenario simulation.",
    highlights: "Org health monitoring; efficiency analytics; staffing optimization; simulations.",
    userHelp: "Helps enterprises continuously optimize structures and allocation.",
    principle: "Combines org graphs, performance modeling, and process data."
  }
];

const sections = [
  {
    locale: "zh",
    key: "hero",
    title: "Tidy 企业级 AI 产品矩阵",
    body: "覆盖组织、流程、项目、产品、绩效等核心场景，以无代码 AI 智能体方式快速落地自动化。"
  },
  {
    locale: "zh",
    key: "solutions",
    title: "解决方案",
    body: "面向组织管理、流程数字化、项目协同、产品管理、绩效与目标管理，提供可组合、可扩展的场景化 AI 能力。"
  },
  {
    locale: "zh",
    key: "about",
    title: "关于我们",
    body: "Tidy 致力于让企业无需编程即可构建 AI 自动化能力，通过“演示一次操作”让 AI 学会跨系统执行复杂任务。"
  },
  {
    locale: "zh",
    key: "core-commonality",
    title: "核心共性",
    body: "所有工具都基于 Tidy 的无代码 AI 智能体技术：无需编程、支持跨软件与跨系统、针对企业垂直场景深度优化。"
  },
  {
    locale: "en",
    key: "hero",
    title: "Tidy Enterprise AI Product Matrix",
    body: "Covering organization, workflow, project, product, and performance scenarios with no-code AI automation."
  },
  {
    locale: "en",
    key: "solutions",
    title: "Solutions",
    body: "Composable and scalable AI solutions for organization management, workflow digitization, project collaboration, product operations, performance, and goals."
  },
  {
    locale: "en",
    key: "about",
    title: "About Us",
    body: "Tidy enables enterprises to build AI automation without coding by teaching AI through one-time operation demonstrations."
  },
  {
    locale: "en",
    key: "core-commonality",
    title: "Shared Core Advantages",
    body: "All products are built on Tidy's no-code AI agent technology: no programming required, cross-system execution, and deep optimization for enterprise vertical scenarios."
  }
];

async function main() {
  const adminPasswordHash = await bcrypt.hash("Admin123!", 10);
  const userPasswordHash = await bcrypt.hash("User123!", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@tidytree.ai" },
    update: { name: "TidyTree Admin", role: Role.ADMIN, passwordHash: adminPasswordHash },
    create: {
      email: "admin@tidytree.ai",
      name: "TidyTree Admin",
      role: Role.ADMIN,
      passwordHash: adminPasswordHash
    }
  });

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@tidytree.ai" },
    update: { name: "Demo Customer", role: Role.CUSTOMER, passwordHash: userPasswordHash },
    create: {
      email: "demo@tidytree.ai",
      name: "Demo Customer",
      role: Role.CUSTOMER,
      passwordHash: userPasswordHash
    }
  });

  const moduleMap = new Map();
  for (const item of moduleDefinitions) {
    const record = await prisma.module.upsert({
      where: { slug: item.slug },
      update: item,
      create: item
    });
    moduleMap.set(record.slug, record);
  }

  for (const narrative of moduleNarratives) {
    const moduleRecord = moduleMap.get(narrative.slug);
    if (!moduleRecord) {
      continue;
    }
    await prisma.moduleNarrative.upsert({
      where: {
        locale_moduleId: {
          locale: narrative.locale,
          moduleId: moduleRecord.id
        }
      },
      update: {
        coreUse: narrative.coreUse,
        useCase: narrative.useCase,
        background: narrative.background,
        painPoint: narrative.painPoint,
        overview: narrative.overview,
        highlights: narrative.highlights,
        userHelp: narrative.userHelp,
        principle: narrative.principle
      },
      create: {
        moduleId: moduleRecord.id,
        locale: narrative.locale,
        coreUse: narrative.coreUse,
        useCase: narrative.useCase,
        background: narrative.background,
        painPoint: narrative.painPoint,
        overview: narrative.overview,
        highlights: narrative.highlights,
        userHelp: narrative.userHelp,
        principle: narrative.principle
      }
    });
  }

  for (const section of sections) {
    await prisma.contentSection.upsert({
      where: {
        locale_key: {
          locale: section.locale,
          key: section.key
        }
      },
      update: {
        title: section.title,
        body: section.body
      },
      create: section
    });
  }

  const purchasedSlugs = ["tidytree-ai", "tidyagent-ai", "tidyflows-ai"];
  const purchasedModules = purchasedSlugs
    .map((slug) => moduleMap.get(slug))
    .filter(Boolean)
    .map((m) => ({ id: m.id, priceCents: m.priceCents }));
  const totalCents = purchasedModules.reduce((sum, item) => sum + item.priceCents, 0);

  const order = await prisma.order.upsert({
    where: { orderNo: "TT-2026-0001" },
    update: {
      status: "PAID",
      totalCents
    },
    create: {
      orderNo: "TT-2026-0001",
      userId: demoUser.id,
      status: "PAID",
      totalCents
    }
  });

  for (const item of purchasedModules) {
    await prisma.orderItem.upsert({
      where: {
        orderId_moduleId: {
          orderId: order.id,
          moduleId: item.id
        }
      },
      update: {
        quantity: 1,
        priceCents: item.priceCents
      },
      create: {
        orderId: order.id,
        moduleId: item.id,
        quantity: 1,
        priceCents: item.priceCents
      }
    });
  }

  for (const moduleRecord of moduleMap.values()) {
    const enabledForDemo = purchasedSlugs.includes(moduleRecord.slug);

    await prisma.previewPermission.upsert({
      where: {
        userId_moduleId: {
          userId: demoUser.id,
          moduleId: moduleRecord.id
        }
      },
      update: { enabled: enabledForDemo },
      create: {
        userId: demoUser.id,
        moduleId: moduleRecord.id,
        enabled: enabledForDemo
      }
    });

    await prisma.previewPermission.upsert({
      where: {
        userId_moduleId: {
          userId: admin.id,
          moduleId: moduleRecord.id
        }
      },
      update: { enabled: true },
      create: {
        userId: admin.id,
        moduleId: moduleRecord.id,
        enabled: true
      }
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
