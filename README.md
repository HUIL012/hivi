# Tidy 销售网站（Tidy Product Sales Site）

一个基于 Next.js + Prisma + SQLite 的完整销售站点实现，支持：

- 产品矩阵展示（背景/痛点/概览/亮点/价值）
- 预览演示与技术原理页面
- 中英文切换（`/zh`、`/en`）
- 登录与“我的模块”（已购买模块、预览权限）
- 后台管理（内容管理、用户管理、订单管理、预览权限管理）

## 1. 环境准备

```bash
npm install
cp .env.example .env
```

`.env` 关键变量：

- `DATABASE_URL`（默认 `file:./prisma/dev.db`）
- `JWT_SECRET`

## 2. 初始化数据库

```bash
npm run db:generate
npm run db:migrate -- --name init
npm run db:seed
```

## 3. 启动开发

```bash
npm run dev
```

默认访问：

- 中文首页：`http://localhost:3000/zh`
- 英文首页：`http://localhost:3000/en`

## 4. 演示账号

- 管理员：`admin@tidytree.ai / Admin123!`
- 普通用户：`demo@tidytree.ai / User123!`

## 5. 技术栈

- Next.js (App Router) + TypeScript
- Prisma 7 + SQLite + `@prisma/adapter-better-sqlite3`
- 简单 JWT Cookie Session 认证
