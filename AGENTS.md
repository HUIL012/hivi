# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

Tidy Sales Site — a bilingual (Chinese/English) Next.js 16 sales and admin platform for the Tidy Enterprise AI Product Matrix. Uses Prisma 7 with SQLite (file-based, no external DB server). All code lives on the `cursor/tidytree-sales-site-8f16` branch (the `main` branch is essentially empty).

### Key commands

| Action | Command |
|---|---|
| Install deps | `npm install` |
| Generate Prisma client | `npm run db:generate` |
| Apply migrations | `npx prisma migrate deploy` |
| Seed database | `npm run db:seed` |
| Dev server | `npm run dev` (port 3000) |
| Build | `npm run build` |

### Environment setup

- Copy `.env.example` to `.env` and set a `JWT_SECRET` value. `DATABASE_URL` defaults to `file:./prisma/dev.db`.
- After `npm install`, run `npm run db:generate` then `npx prisma migrate deploy` then `npm run db:seed` to initialize the SQLite database with demo data.

### Demo accounts (after seeding)

- Admin: `admin@tidytree.ai` / `Admin123!`
- Customer: `demo@tidytree.ai` / `User123!`

### Gotchas

- **Lint**: The project uses `.eslintrc.json` (legacy config format) with ESLint 10, which requires flat config (`eslint.config.js`). Running `npm run lint` or `npx eslint` fails due to this mismatch. This is a pre-existing issue in the codebase.
- **Next.js 16**: The `next lint` subcommand was removed in Next.js 16. Lint must be run via `npx eslint` directly (once the config format is fixed).
- **Prisma migrations**: Use `npx prisma migrate deploy` (not `npm run db:migrate`) for non-interactive migration application. `npm run db:migrate` runs `prisma migrate dev` which may prompt interactively.
- **SQLite**: The database is file-based at `prisma/dev.db` — no external database server needed.
- **Locale routing**: The root `/` redirects (307) to a locale path (`/zh` or `/en`). Always use locale-prefixed URLs.
