---
applyTo: "**/*.{ts,tsx,js,jsx}"
---

# Copilot / AI Agent Guide — portfolio monorepo (concise)

This file highlights project-specific workflows, conventions, and entry points to help AI agents be productive immediately.

- Project layout: a Turbo monorepo with workspaces: `apps/*`, `packages/*`, `tooling/*`.
- Key directories: `apps/web` and `apps/dashboard` (frontends), `packages/api` (tRPC server), `packages/db` (drizzle schema), `ui/src` (shared UI components), `shared/src` (shared client helpers).

Essential commands (root):
- Install: `bun install` (project uses Bun as `packageManager`).
- Dev (local): `bun + turbo watch dev --continue` or `bun run dev` — uses `turbo` to run workspace dev scripts.
- Build: `bun run build` (runs `turbo run build`).
- Typecheck: `bun run typecheck` (Turbo task across workspaces).
- Format / lint: `bun run format` / `bun run lint` (uses `biome`).

Quick patterns to follow (discoverable in code):
- Routing: frontends implement `src/router.tsx` (see [apps/web/src/router.tsx](apps/web/src/router.tsx) and [apps/dashboard/src/router.tsx](apps/dashboard/src/router.tsx)).
- API: `packages/api/src/index.ts` wires tRPC; follow `create-trpc-client.tsx` in `shared/src` for client usage.
- UI: shared components live under `ui/src` — prefer these for design system consistency (e.g., `ui/src/button.tsx`, `ui/src/avatar.tsx`).
- DB: `packages/db` contains `drizzle.config.ts` and schema; migrations/`push` tasks are run via `turbo` (see `db:push` script).

Conventions and constraints (from repo rules):
- Accessibility-first: check `ui` and pages for required a11y attributes (title on SVGs, semantic elements, inputs labeled). See existing a11y rules in this repo.
- Use `for...of` rather than `Array.forEach` in shared utilities.
- Avoid `any` / non-null assertions; prefer `import type` for types.
- No console usage in committed code; linting enforces this.

Tooling notes for agents:
- Formatting/linting: `biome` is the canonical formatter/linter. Use `bun x ultracite format` only when aligning with ultracite tasks in `lint-staged`.
- Code generation: `turbo run ui-add` integrates with `shadcn`/`ui/components.json` for adding UI parts.
- Pre-commit: `husky` + `lint-staged` run Biome checks; ensure fixes are applied via `biome format --write` before committing.

What to edit or inspect first when making changes:
- Update routes: edit `apps/*/src/routeTree.gen.ts` and `router.tsx` together.
- Add API endpoints: change `packages/api/src/router/*` and update `shared/create-trpc-client.tsx` if client surface changes.
- Add a component: add to `ui/src`, then update `ui/components.json` if using `shadcn` tooling.

PR guidance for AI edits:
- Keep changes small and focused per package; run `bun run typecheck` and `bun run lint:fix` before opening PR.
- Reference affected workspaces in PR description (e.g., `apps/web`, `packages/api`).

If anything is ambiguous, ask the human for missing env values (e.g., secrets, DB URLs). Always avoid writing hardcoded credentials.

---
Keep this file minimal and update with concrete examples if you want more automation tips (CI commands, env templates, or codegen hooks).
- Don't use constant expressions in conditions.
