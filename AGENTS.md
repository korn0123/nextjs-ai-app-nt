<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Project: nextjs-ai-app-starter

## Development Guidelines

For TypeScript code style and best practices: @docs/typescript-guidelines.md


## Commands
- `npm run dev` — start dev server (http://localhost:3000)
- `npm run build` — production build
- `npm run lint` — eslint (config in `eslint.config.mjs`)
- `node scripts/insert-data.mjs` — seed database with initial data
- No test framework or test scripts configured.

## Stack specifics
- **Next.js 16.2.7** (App Router), **React 19.2.7**. Read `node_modules/next/dist/docs/` before writing code — this version has breaking changes from the docs in your training data.
- **Tailwind v4** with `@tailwindcss/postcss` (PostCSS config in `postcss.config.mjs`). CSS entry: `src/app/globals.css`.
- **shadcn/ui** (Radix Luma style, Remixicon icons). Configured in `components.json`. Use `npx shadcn@latest add <component>` to add new UI primitives.
- **Prisma 7** with **MariaDB adapter** (`@prisma/adapter-mariadb`). Generated client lives at `generated/prisma/` (not in `node_modules`). Import from `@/lib/prisma` (singleton, global cached).
  - Run `npx prisma generate` after schema changes.
  - Schema: `prisma/schema.prisma`. Config: `prisma.config.ts`.
  - `DATABASE_URL` must be set in `.env`. For local MariaDB, see `docs/install_mariadb_with_docker.txt`.
- **Better Auth 1.6.11** configured at `src/lib/auth.ts` (email+password). Catch-all route at `src/app/api/auth/[...all]/route.ts`. Client helper at `src/lib/auth-client.ts`.
- **Zustand** cart store in `src/lib/cart-store.ts` (persisted to localStorage key `skill-cart`).

## Architecture notes
- **Route groups**: `(front)/` (public pages) has its own `<html>` layout at `(front)/layout.tsx`; `(auth)/` (login/signup) has a separate `<html>` layout with Thai fonts. Neither uses a root `app/layout.tsx`.
- **Dynamic routes** use `await connection()` from `next/server` to mark pages as dynamic (see `product/page.tsx`).
- **Path alias**: `@/*` maps to `src/*` (tsconfig paths).
- `clsx` + `tailwind-merge` via `cn()` helper in `src/lib/utils.ts`.

## Generated / ignored
- `.env` is gitignored; copy the expected vars from `.env` (already present locally).
- `/generated/prisma` is gitignored (Prisma generated client).
- No CI workflows (`.github/` directory absent).
