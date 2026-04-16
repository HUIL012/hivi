import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TidyTree Sales Site",
  description: "TidyTree.ai AI product matrix and admin platform"
};

type RootLayoutProps = {
  children: React.ReactNode;
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  );
}
