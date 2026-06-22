# Kosmos GPS API

Elysia API server with Better Auth (GitHub OAuth) and Turso (SQLite via Drizzle ORM).

![ElysiaJS](https://img.shields.io/badge/-ElysiaJS-black?style=flat&logoColor=white&logo=data:image/svg%2bxml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAzMiAzMiI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xNiAwQzcuMTYgMCAwIDcuMTYgMCAxNnM3LjE2IDE2IDE2IDE2IDE2LTcuMTYgMTYtMTZTMjQuODQgMCAxNiAwem0wIDI4Yy02LjYzIDAtMTItNS4zNy0xMi0xMlM5LjM3IDQgMTYgNHMxMiA1LjM3IDEyIDEyLTUuMzcgMTItMTIgMTJ6Ii8+PC9zdmc+)
![Bun](https://img.shields.io/badge/Bun-ffffff.svg?style=flat&logo=Bun&logoColor=000000)
![Better Auth](https://img.shields.io/badge/Better%20Auth-ffffff.svg?style=flat&logo=Better%20Auth&logoColor=000000)
![Turso](https://img.shields.io/badge/Turso-ffffff.svg?style=flat&logo=Turso&logoColor=000000)
## Prerequisites

- [Bun](https://bun.sh) >= 1.2
- A [Turso](https://turso.tech) database URL and auth token
- A [GitHub OAuth App](https://github.com/settings/developers) (callback URL: `http://localhost:3000/api/auth/callback/github`)

## Getting Started

### 1. Install dependencies

```bash
bun install
```

### 2. Set environment variables

Copy or create `apps/api/.env`:

```env
BETTER_AUTH_SECRET=<generate with: openssl rand -hex 32>
BETTER_AUTH_URL=http://localhost:3000

TURSO_DATABASE_URL=libsql://<your-db>.turso.io
TURSO_AUTH_TOKEN=<your-turso-token>

GITHUB_CLIENT_ID=<your-github-oauth-client-id>
GITHUB_CLIENT_SECRET=<your-github-oauth-client-secret>

CLIENT_URL=http://localhost:4321
PUBLIC_API_URL=http://localhost:3000
```

### 3. Run database migrations

```bash
bunx drizzle-kit generate
bunx drizzle-kit migrate
```

### 4. Start the dev server

```bash
bun run dev
```

The server starts at [http://localhost:3000](http://localhost:3000).

## API Endpoints

All routes are prefixed with `/api`.

### Auth

| Method | Path | Description |
|--------|------|-------------|
| `*` | `/api/auth/*` | Better Auth handlers (sign-in, callback, session, etc.) |

All inventory endpoints require a valid Better Auth session. Authenticate via GitHub OAuth at `/api/auth/signin/github`.

### Inventory Items

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/inventory/list` | List active items (supports `limit`, `offset`, `search`) |
| `GET` | `/api/inventory/item/:id` | Get a single item |
| `POST` | `/api/inventory/add` | Create an item (`{ "name": "..." }`) |
| `PUT` | `/api/inventory/update` | Update an item (`{ "id": "...", "name"?: "...", "deletedAt"?: null \| string }`) |
| `DELETE` | `/api/inventory/delete/:id` | Soft-delete an item (sets `deleted_at`) |

Items are scoped to the authenticated user's account.

## Database

Schema is defined in `data/schema.ts`. Migrations live in `data/migrations/`.

### Schema — `inventory_items`

| Column | Type | Notes |
|--------|------|-------|
| `id` | `text` | Primary key |
| `name` | `text` | Not null |
| `account` | `text` | User email, not null |
| `count` | `integer` | Not null, defaults to 0 |
| `deleted_at` | `text` | Nullable — logical delete |

### Drizzle commands

```bash
bunx drizzle-kit generate   # Generate migration from schema changes
bunx drizzle-kit migrate    # Apply migrations to Turso
bunx drizzle-kit studio     # Open Drizzle Studio (requires drizzle.config.ts with Turso credentials)
```

## Scripts

| Command | Description |
|---------|-------------|
| `bun run dev` | Start dev server with `--watch` on port 3000 |
| `bun run test` | Placeholder (no tests yet) |
