# kosmos-gps

## Stack

- **Runtime**: Bun (not Node). Lockfile: `bun.lock`.
- **Monorepo**: Bun workspaces — `apps/api` (Elysia) + `apps/web` (Astro + React + Tailwind CSS v4).
- **Modules**: ESM throughout (`"type": "module"`).

## Commands

| Command | Action |
|---------|--------|
| `bun run dev:server` | Start Elysia API on `localhost:3000` with `--watch` |
| `bun run dev:web` | Start Astro dev server on `localhost:4321` |
| `bun run lint` | ESLint (flat config) across all packages |
| `bun run lint:fix` | ESLint with `--fix` |
| `bun run fmt` | Prettier (write) across the whole tree |
| `bun run fmt:check` | Prettier (check only) |
| `bun run prepare` | Install Husky hooks |

No typecheck or test commands exist.

## Code style

- **Prettier**: tabs, no semicolons, single quotes, 150 print width, plugins for Astro + Tailwind.
- **ESLint**: flat config, TypeScript + Astro + React + React Hooks plugins. Ignores `dist/`, `node_modules/`, `build/`, `.astro/`.
- **Pre-commit hook** (Husky): runs `bunx lint-staged` → `eslint --fix` + `prettier --write` on staged `*.{astro,js,jsx,ts,tsx}` files.
- **Root tsconfig**: `verbatimModuleSyntax` (use `import type` for type-only imports), `module: "Preserve"`, `moduleResolution: "bundler"`, `noEmit`.
- **API tsconfig** (`apps/api`): separate — `"ES2022"` target, `"module": "ES2022"`, `"moduleResolution": "node"`, `"types": ["bun-types"]`.

## Package boundaries

- `apps/api/` — Elysia server. Entry: `src/index.ts`. Single route at `GET /`. Dev: `bun run --watch src/index.ts`.
- `apps/web/` — Astro site with React islands. Entry: `src/pages/index.astro`. Config: `astro.config.mjs` (React + Tailwind Vite plugin).

## Dependency quirks

- `bunfig.toml` at root (and each workspace) sets `exact = true` + `minimumReleaseAge = 86400`. This means all dependency versions are pinned in `package.json`; updates younger than 24h are blocked by default.
