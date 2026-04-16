import { chromium } from "playwright";
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const baseUrl = "http://127.0.0.1:3000";
const artifactsDir = "/opt/cursor/artifacts";
const shotsDir = path.join(artifactsDir, "ui_shots");
const videoPath = path.join(artifactsDir, "tidytree_sales_site_walkthrough.mp4");

fs.mkdirSync(shotsDir, { recursive: true });

const checks = [];
const shotFiles = [];

const browser = await chromium.launch({
  headless: true,
  args: ["--window-size=1440,900", "--force-device-scale-factor=1"],
});
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

async function shot(name) {
  const filePath = path.join(shotsDir, `${name}.png`);
  await page.screenshot({ path: filePath, fullPage: true });
  shotFiles.push(filePath);
  return filePath;
}

function pass(step, detail) {
  checks.push({ step, status: "PASS", detail });
}

function fail(step, detail) {
  checks.push({ step, status: "FAIL", detail });
}

function addAssert(condition, step, success, failure) {
  if (condition) {
    pass(step, success);
  } else {
    fail(step, failure);
  }
}

try {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded" });
  await page.evaluate(() => {
    localStorage.removeItem("tidytree-site-state-v1");
  });
  await page.reload({ waitUntil: "domcontentloaded" });
  await page.waitForTimeout(400);
  await shot("01_home_zh");

  // Step 1: demo progression to 100%.
  await page.getByRole("button", { name: "开始录制" }).click();
  await page.waitForTimeout(1600);
  const demoSuccess = await page.getByText("AI 已学习该操作，正在生成自动化策略。").isVisible();
  addAssert(
    demoSuccess,
    "Step 1 demo module",
    "Demo progress reaches learned state",
    "Demo learned feedback not visible"
  );
  await shot("02_demo_success");

  // Step 2: language toggle zh -> en -> zh.
  await page.locator("button.language-switch", { hasText: "EN" }).first().click();
  await page.waitForTimeout(300);
  const enNavVisible = await page.getByRole("link", { name: "Products" }).isVisible();
  const enPurchaseVisible = await page.getByRole("link", { name: "Buy Modules" }).isVisible();
  addAssert(
    enNavVisible && enPurchaseVisible,
    "Step 2 language zh->en",
    "Navbar switched to English labels",
    "English nav labels did not appear"
  );
  await shot("03_nav_en");

  await page.locator("button.language-switch", { hasText: "中文" }).first().click();
  await page.waitForTimeout(300);
  const zhNavVisible = await page.getByRole("link", { name: "产品矩阵" }).isVisible();
  addAssert(
    zhNavVisible,
    "Step 2 language en->zh",
    "Navbar switched back to Chinese labels",
    "Chinese nav labels did not reappear"
  );
  await shot("04_nav_zh");

  // Step 3: product matrix -> tidytree details.
  await page.getByRole("link", { name: "产品矩阵" }).click();
  await page.waitForURL("**/products");
  await page.waitForTimeout(300);
  await page.getByRole("link", { name: "查看详情" }).first().click();
  await page.waitForURL("**/products/**");
  await page.waitForTimeout(300);
  const hasPain = await page.getByText("核心痛点").isVisible();
  const hasAiSolution = await page.getByText("AI 解决方案").isVisible();
  const hasWorkflow = await page.getByText("自动化场景流程").isVisible();
  const hasValue = await page.getByText("价值收益").isVisible();
  addAssert(
    hasPain && hasAiSolution && hasWorkflow && hasValue,
    "Step 3 product detail structure",
    "TidyTree detail includes pain/solution/workflow/value sections",
    "TidyTree detail sections incomplete"
  );
  await shot("05_product_detail");

  // Clear persisted state to simulate logout for step 4.
  await page.evaluate(() => {
    localStorage.removeItem("tidytree-site-state-v1");
    location.reload();
  });
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(400);
  await page.goto(`${baseUrl}/purchase`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);

  // Step 4: purchase while logged out -> notice + redirect login.
  const firstCheckbox = page.locator('input[type="checkbox"]').first();
  await firstCheckbox.check();
  await page.getByLabel("企业名称").fill("未登录测试企业");
  await page.getByRole("button", { name: "提交订单" }).click();
  const loginNotice = await page.getByText("请先登录后购买模块").isVisible();
  await page.waitForTimeout(900);
  const redirectedToLogin = page.url().includes("/login");
  addAssert(
    loginNotice && redirectedToLogin,
    "Step 4 purchase requires login",
    "Logged-out purchase shows notice and redirects to login",
    "Logged-out purchase did not enforce login flow"
  );
  await shot("06_purchase_requires_login");

  // Step 5: login page includes preview links + login.
  const hasPreview = await page.getByRole("link", { name: "预览演示" }).isVisible();
  const hasTech = await page.getByRole("link", { name: "查看技术原理" }).isVisible();
  await page.getByLabel("企业邮箱").fill("admin@test.com");
  await page.getByLabel("密码").fill("password123");
  await page.getByRole("button", { name: "登录并继续" }).click();
  await page.waitForURL("**/purchase");
  addAssert(
    hasPreview && hasTech && page.url().includes("/purchase"),
    "Step 5 login page and login action",
    "Preview/tech links visible and login succeeds",
    "Login page links missing or login failed"
  );
  await shot("07_login_success");

  // Step 6: purchase while logged in -> success and form reset.
  await page.locator('input[type="checkbox"]').first().check();
  await page.getByLabel("企业名称").fill("TechCorp Inc");
  await page.getByRole("button", { name: "提交订单" }).click();
  const successOrder = await page.getByText("订单已创建，销售顾问将尽快联系你。").isVisible();
  const companyReset = (await page.getByLabel("企业名称").inputValue()) === "";
  addAssert(
    successOrder && companyReset,
    "Step 6 logged-in purchase",
    "Purchase shows success feedback and resets form",
    "Logged-in purchase did not show success/reset behavior"
  );
  await shot("08_purchase_success");

  // Step 7: open admin and ensure tabs accessible.
  await page.goto(`${baseUrl}/admin`, { waitUntil: "domcontentloaded" });
  await page.waitForTimeout(300);
  const adminTitle = await page.getByText("后台管理中心").isVisible();
  const usersTab = await page.getByRole("button", { name: "用户管理" }).isVisible();
  const ordersTab = await page.getByRole("button", { name: "订单管理" }).isVisible();
  addAssert(
    adminTitle && usersTab && ordersTab,
    "Step 7 admin access",
    "Admin tabs accessible after login",
    "Admin page/tabs not accessible after login"
  );
  await shot("09_admin_home");

  // Step 8: add one user.
  await page.getByRole("button", { name: "用户管理" }).click();
  await page.waitForTimeout(300);
  await page.getByLabel("姓名").fill("Auto Tester");
  await page.getByLabel("邮箱").fill("autotester@company.com");
  await page.getByRole("button", { name: "添加用户" }).click();
  const userAdded = await page.getByRole("cell", { name: "Auto Tester" }).isVisible();

  // Step 8: add one order.
  await page.getByRole("button", { name: "订单管理" }).click();
  await page.waitForTimeout(300);
  await page.getByLabel("模块").fill("组织架构同步引擎");
  await page.getByLabel("购买企业").fill("Regression Co");
  await page.getByLabel("金额").fill("4999");
  await page.getByRole("button", { name: "添加订单" }).click();
  const orderAdded = await page.getByRole("cell", { name: "Regression Co" }).isVisible();
  addAssert(
    userAdded && orderAdded,
    "Step 8 add user and order",
    "Admin tables include newly added user and order",
    "Failed to add user or order in admin tables"
  );
  await shot("10_admin_order_added");

  // Step 9: switch to English on admin page.
  await page.locator("button.language-switch", { hasText: "EN" }).first().click();
  await page.waitForTimeout(300);
  const enAdminTab = await page.getByRole("button", { name: "Order Management" }).isVisible();
  const enColumn = await page.getByRole("columnheader", { name: "Buyer" }).isVisible();
  addAssert(
    enAdminTab && enColumn,
    "Step 9 admin i18n",
    "Admin labels switch to English",
    "Admin labels did not switch to English"
  );
  await shot("11_admin_en");

  // Keep final page on order view.
  await page.getByRole("button", { name: "Order Management" }).click();
  await page.waitForTimeout(200);
  await shot("12_admin_orders_final");
} catch (error) {
  checks.push({
    step: "Script execution",
    status: "FAIL",
    detail: `Unexpected error: ${error instanceof Error ? error.message : String(error)}`,
  });
} finally {
  await browser.close();
}

// Build short slideshow video from screenshots.
if (shotFiles.length > 0) {
  const listPath = path.join(shotsDir, "frames.txt");
  const listContent = shotFiles
    .map((file) => `file '${file.replace(/'/g, "'\\''")}'\nduration 1.2`)
    .join("\n");
  fs.writeFileSync(listPath, `${listContent}\nfile '${shotFiles[shotFiles.length - 1]}'\n`);
  execSync(
    `ffmpeg -y -f concat -safe 0 -i "${listPath}" -vf "fps=25,format=yuv420p,scale=1280:-2" "${videoPath}"`,
    { stdio: "ignore" }
  );
}

const report = {
  generatedAt: new Date().toISOString(),
  checks,
  screenshots: shotFiles,
  video: fs.existsSync(videoPath) ? videoPath : null,
};

fs.writeFileSync(path.join(artifactsDir, "ui_regression_report.json"), JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
