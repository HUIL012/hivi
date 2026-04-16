import "./globals.css";
import { AppProvider } from "../components/app-context";
import { AppShell } from "../components/app-shell";

export const metadata = {
  title: "TidyTree.ai | Enterprise Productivity Reimagined",
  description:
    "Tidy.ai 重塑企业生产力，让管理回归业务本身。TidyTree 销售与解决方案网站。",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-CN">
      <body>
        <AppProvider>
          <AppShell>{children}</AppShell>
        </AppProvider>
      </body>
    </html>
  );
}
