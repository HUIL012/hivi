"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AppContext = createContext(null);
const STORAGE_KEY = "tidytree-site-state-v1";

const defaultModules = [
  {
    id: "org-sync",
    name: "组织架构同步引擎",
    nameEn: "Organization Sync Engine",
    descriptionZh: "部门变动后自动同步组织树与汇报链路。",
    descriptionEn: "Auto-sync org tree and reporting chains after re-org updates.",
    price: 1999,
    selected: false,
  },
  {
    id: "permission-automation",
    name: "权限自动调整模块",
    nameEn: "Permission Automation Module",
    descriptionZh: "基于岗位和角色策略自动调整系统访问权限。",
    descriptionEn: "Automatically adjust system permissions based on role strategy.",
    price: 2499,
    selected: false,
  },
  {
    id: "reporting-chain",
    name: "汇报链路智能分析",
    nameEn: "Reporting Chain Analyzer",
    descriptionZh: "分析组织汇报结构并自动修复审批链路。",
    descriptionEn: "Analyze org reporting structures and auto-repair approval flows.",
    price: 1699,
    selected: false,
  },
];

const defaultUsers = [
  { id: "u001", name: "Li Wei", email: "liwei@enterprise.com", role: "Admin", status: "active" },
  { id: "u002", name: "Grace Chen", email: "grace.hr@enterprise.com", role: "Manager", status: "active" },
  { id: "u003", name: "Tom Li", email: "tom.ops@enterprise.com", role: "Viewer", status: "pending" },
];

const defaultOrders = [
  { id: "o2026041601", module: "权限自动调整模块", buyer: "BrightData Inc.", amount: 2499, status: "Paid" },
  { id: "o2026041602", module: "组织架构同步引擎", buyer: "Northwind Labs", amount: 1999, status: "Trial" },
];

const defaultContent = {
  zh: {
    heroTitle: "连接、分析、自动化 —— 构建你的企业智能大脑",
    heroSubtitle:
      "Tidy.ai —— 重塑企业生产力，让管理回归业务本身。以无代码 AI 深度嵌入组织管理流程。",
    heroSlogan: "Tidy.ai —— 重塑企业生产力，让管理回归业务本身。",
  },
  en: {
    heroTitle: "Connect, Analyze, Automate — Build Your Enterprise AI Brain",
    heroSubtitle:
      "Tidy.ai reimagines enterprise productivity and lets management focus on real business outcomes.",
    heroSlogan: "Tidy.ai — Reimagining enterprise productivity for business-first management.",
  },
};

const dictionary = {
  zh: {
    nav: {
      brandTitle: "TidyTree.ai",
      slogan: "重塑企业生产力，让管理回归业务本身",
      productMatrix: "产品矩阵",
      solutions: "解决方案",
      about: "关于我们",
      tech: "技术原理",
      purchase: "购买模块",
      admin: "后台管理",
      login: "登录",
      logout: "退出登录",
    },
    actions: {
      tryNow: "立即试用",
      viewDetail: "查看详情",
      requestTrial: "申请试用",
      loginRequired: "请先登录后购买模块",
      save: "保存",
      preview: "预览演示",
      viewTech: "查看技术原理",
      loginNow: "立即登录",
      buy: "购买",
      addUser: "添加用户",
      addOrder: "添加订单",
    },
    home: {
      tryNow: "立即试用",
      viewTech: "查看技术原理",
      matrixTitle: "产品矩阵（3x3）",
      matrixSubtitle: "9 款 Tidy 产品覆盖组织、研发、运营管理全场景，点击进入详情页。",
      capabilityTitle: "核心能力",
      capabilities: [
        { title: "无代码演示学习", desc: "演示一次流程，AI 即可学习并复用复杂业务动作。" },
        { title: "跨系统执行", desc: "无需 API，打通 ERP、OA、财务系统与旧后台。" },
        { title: "垂直场景专业度", desc: "从 OKR 到组织架构，深度嵌入企业管理细节。" },
      ],
      demoTitle: "演示即学习",
      demoDesc: "点击开始录制，模拟拖拽操作，AI 将自动反馈“已学习该流程”。",
      startRecording: "开始录制",
      aiLearned: "AI 已学习该操作，正在生成自动化策略。",
      quizTitle: "智能匹配测试（AI Quiz）",
      compareTitle: "传统 SaaS vs Tidy AI 系统",
      solutionTitle: "行业解决方案组合",
      trustTitle: "信任背书与常见问题",
      requestTrial: "申请试用",
    },
    products: {
      title: "Tidy 产品矩阵",
      subtitle: "每个模块都基于无代码 AI 智能体技术，可独立部署，也可组合行业方案。",
      viewDetail: "查看详情",
    },
    productDetail: {
      painPoint: "核心痛点",
      aiSolution: "AI 解决方案",
      workflow: "自动化场景流程",
      value: "价值收益",
    },
    solutions: {
      title: "解决方案页",
      subtitle: "将产品能力组合为角色与行业方案，快速形成业务闭环。",
      recommendedModules: "推荐模块",
    },
    about: {
      title: "关于 Tidy.ai",
      subtitle: "我们让 AI 成为企业管理系统中的执行层，而不仅是分析助手。",
    },
    login: {
      title: "登录 Tidy 平台",
      subtitle: "登录后可查看购买模块、管理后台并体验个性化演示。",
      account: "邮箱账号",
      password: "密码",
      submit: "登录并继续",
      demo: "预览演示",
      goTech: "查看技术原理",
      loginButton: "登录并继续",
    },
    tech: {
      title: "Tidy 无代码 AI 技术原理",
      subtitle: "通过演示学习 + 视觉识别 + 策略引擎，实现跨系统自动执行。",
    },
    purchase: {
      title: "购买模块",
      subtitle: "选择你需要的 TidyTree 能力模块，支持按模块年度订阅。",
      total: "总计",
      loginHint: "你尚未登录，点击按钮跳转登录后购买。",
      loginRequired: "请先登录后购买模块。",
      loginToSelect: "点击模块前请先登录。",
      formIncomplete: "请至少选择一个模块并填写企业名称。",
      orderPlaced: "订单已创建，销售顾问将尽快联系你。",
      company: "企业名称",
      companyPlaceholder: "请输入企业名称",
      selectedCount: "已选模块数",
      createOrder: "提交订单",
    },
    admin: {
      title: "后台管理中心",
      subtitle: "管理介绍内容、用户与订单，支持运营团队快速更新销售站点。",
      contentTab: "介绍内容管理",
      userTab: "用户管理",
      orderTab: "订单管理",
      heroTitle: "首页标题",
      heroSubtitle: "首页副标题",
      languageScope: "编辑语言",
      username: "姓名",
      email: "邮箱",
      role: "角色",
      status: "状态",
      module: "模块",
      buyer: "购买企业",
      amount: "金额",
      orderStatus: "订单状态",
      content: "介绍内容管理",
      users: "用户管理",
      orders: "订单管理",
      addUser: "添加用户",
      addOrder: "添加订单",
    },
    solutionsPage: {
      title: "解决方案组合",
      subtitle: "按团队场景组合 Tidy 组件，加速落地。",
      recommendedModules: "推荐模块",
    },
    common: {
      loginRequired: "请先登录后访问该页面。",
    },
  },
  en: {
    nav: {
      brandTitle: "TidyTree.ai",
      slogan: "Reimagine productivity, keep management business-first",
      productMatrix: "Products",
      solutions: "Solutions",
      about: "About",
      tech: "Tech",
      purchase: "Buy Modules",
      admin: "Admin",
      login: "Login",
      logout: "Logout",
    },
    actions: {
      tryNow: "Start Trial",
      viewDetail: "View Details",
      requestTrial: "Request Trial",
      loginRequired: "Please login before purchasing modules",
      save: "Save",
      preview: "Preview Demo",
      viewTech: "View Technical Principles",
      loginNow: "Login Now",
      buy: "Purchase",
      addUser: "Add User",
      addOrder: "Add Order",
    },
    home: {
      tryNow: "Start Trial",
      viewTech: "View Technical Principles",
      matrixTitle: "Product Matrix (3x3)",
      matrixSubtitle:
        "Nine Tidy products cover organization, R&D, and operations. Click any card for details.",
      capabilityTitle: "Core Capabilities",
      capabilities: [
        { title: "No-code Demo Learning", desc: "Demonstrate once and AI replicates complex workflows." },
        { title: "Cross-system Execution", desc: "No API required for ERP, OA, finance, or legacy back-office tools." },
        { title: "Vertical Domain Expertise", desc: "Deeply optimized for OKR, org design, and enterprise operations." },
      ],
      demoTitle: "Demo-to-Learn Module",
      demoDesc: "Click start recording, mimic one drag action, and AI confirms it has learned.",
      startRecording: "Start Recording",
      aiLearned: "AI has learned this action and is generating automation policy.",
      quizTitle: "Intelligent Recommendation Quiz",
      compareTitle: "Traditional SaaS vs Tidy AI",
      solutionTitle: "Industry Solution Bundles",
      trustTitle: "Trust & FAQ",
      requestTrial: "Request Trial",
    },
    products: {
      title: "Tidy Product Matrix",
      subtitle: "Every module is powered by no-code AI agents and can be deployed alone or bundled.",
      viewDetail: "View Details",
    },
    productDetail: {
      painPoint: "Core Pain Point",
      aiSolution: "AI Solution",
      workflow: "Automation Workflow",
      value: "Business Value",
    },
    solutions: {
      title: "Solution Pages",
      subtitle: "Bundle products by team responsibility and business scenarios.",
      recommendedModules: "Recommended Modules",
    },
    about: {
      title: "About Tidy.ai",
      subtitle: "We make AI an execution layer inside management systems, not only an analytics layer.",
    },
    login: {
      title: "Login to Tidy Platform",
      subtitle: "Sign in to purchase modules, access admin tools, and run tailored demos.",
      account: "Email",
      password: "Password",
      submit: "Login and Continue",
      demo: "Preview Demo",
      goTech: "View Tech Principles",
      loginButton: "Login and Continue",
    },
    tech: {
      title: "No-code AI Technical Principles",
      subtitle: "Demo learning + visual recognition + strategy engine for cross-system execution.",
    },
    purchase: {
      title: "Purchase Modules",
      subtitle: "Choose TidyTree modules with annual subscription pricing.",
      total: "Total",
      loginHint: "You are not logged in. Please sign in before purchasing.",
      loginRequired: "Please login before purchasing modules.",
      loginToSelect: "Please login before selecting modules.",
      formIncomplete: "Please select at least one module and enter company name.",
      orderPlaced: "Order created. Our consultant will contact you shortly.",
      company: "Company Name",
      companyPlaceholder: "Enter your company name",
      selectedCount: "Selected Modules",
      createOrder: "Place Order",
    },
    admin: {
      title: "Back-office Management",
      subtitle: "Manage website content, users, and orders for sales operations.",
      contentTab: "Content",
      userTab: "Users",
      orderTab: "Orders",
      heroTitle: "Homepage Hero Title",
      heroSubtitle: "Homepage Hero Subtitle",
      languageScope: "Edit Language",
      username: "Name",
      email: "Email",
      role: "Role",
      status: "Status",
      module: "Module",
      buyer: "Buyer",
      amount: "Amount",
      orderStatus: "Order Status",
      content: "Content Management",
      users: "User Management",
      orders: "Order Management",
      addUser: "Add User",
      addOrder: "Add Order",
    },
    solutionsPage: {
      title: "Solution Bundles",
      subtitle: "Bundle Tidy modules by business functions to accelerate rollout.",
      recommendedModules: "Recommended Modules",
    },
    common: {
      loginRequired: "Please login first to access this page.",
    },
  },
};

export function AppProvider({ children }) {
  const [language, setLanguage] = useState("zh");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modules, setModules] = useState(defaultModules);
  const [users, setUsers] = useState(defaultUsers);
  const [orders, setOrders] = useState(defaultOrders);
  const [content, setContent] = useState(defaultContent);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setHydrated(true);
        return;
      }
      const parsed = JSON.parse(raw);
      if (parsed.language) setLanguage(parsed.language);
      if (typeof parsed.isLoggedIn === "boolean") setIsLoggedIn(parsed.isLoggedIn);
      if (Array.isArray(parsed.modules)) setModules(parsed.modules);
      if (Array.isArray(parsed.users)) setUsers(parsed.users);
      if (Array.isArray(parsed.orders)) setOrders(parsed.orders);
      if (parsed.content?.zh && parsed.content?.en) setContent(parsed.content);
    } catch (_error) {
      // Keep defaults when storage data is invalid.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    const payload = { language, isLoggedIn, modules, users, orders, content };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }, [hydrated, language, isLoggedIn, modules, users, orders, content]);

  const addOrder = (orderInput) => {
    const nextId = `o${new Date().toISOString().slice(0, 10).replaceAll("-", "")}${String(
      Math.floor(Math.random() * 900 + 100)
    )}`;
    setOrders((previous) => [...previous, { id: nextId, ...orderInput }]);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage((prev) => (prev === "zh" ? "en" : "zh")),
      dictionary: dictionary[language],
      isLoggedIn,
      login: () => setIsLoggedIn(true),
      logout: () => setIsLoggedIn(false),
      modules,
      setModules,
      users,
      setUsers,
      orders,
      setOrders,
      addOrder,
      content,
      setContent,
    }),
    [language, isLoggedIn, modules, users, orders, content]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within AppProvider");
  }
  return context;
}
