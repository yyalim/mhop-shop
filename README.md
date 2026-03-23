# Shop

Next.js 16.2 e-commerce app — App Router, Prisma 6, Neon/PostgreSQL, scratch-built session auth (AES-GCM cookies, no auth library).

## Stack

- **Next.js 16.2** — App Router, Turbopack
- **Prisma 6** — ORM with migration tracking
- **PostgreSQL** — local via Docker Compose, production via Neon
- **Tailwind CSS**
- **bcryptjs** — password hashing
- **Web Crypto API** — AES-GCM session encryption

## Environment Variables

Create a `.env.local` file in the project root:

```bash
# Generate with: openssl rand -hex 32
SESSION_SECRET=

# Local (Docker):
DATABASE_URL=postgresql://shop:shop@localhost:5432/shop?sslmode=disable

# Neon (production):
# DATABASE_URL=postgres://...neon.tech/...?sslmode=require
```

---

## Local Development (Docker)

### First-time setup

```bash
# 1. Start the database
docker compose up -d db

# 2. Generate migration files and apply them
npx prisma migrate dev --name init

# 3. Start the full stack
npm run dev
```

### Subsequent runs

```bash
docker compose up -d db
npm run dev
```

### Schema changes

```bash
# Edit prisma/schema.prisma, then:
npx prisma migrate dev --name <description>
```

---

## Docker (fully containerised)

> **Important:** migration files must exist before running the full stack.
> If `prisma/migrations/` is empty, complete the first-time setup above first.

```bash
# Build and start everything (db + migrate + app)
docker compose up --build

# Tear down and wipe the database volume
docker compose down -v
```

Services:

| Service   | Description                                              |
|-----------|----------------------------------------------------------|
| `db`      | Postgres 16 — exposed on `localhost:5432`                |
| `migrate` | Runs `prisma migrate deploy` on startup, then exits      |
| `app`     | Next.js production server — exposed on `localhost:3000`  |

`migrate` runs before `app` and only starts after `db` passes its healthcheck.

---

## Migration workflow

| Situation | Command |
|---|---|
| First-time / new clone | `npx prisma migrate dev --name init` |
| New schema change | `npx prisma migrate dev --name <description>` |
| Check pending migrations | `npx prisma migrate status` |
| Production / containers | `prisma migrate deploy` (runs automatically via Docker) |

Migration SQL files live in `prisma/migrations/` and are committed to git so every environment applies the same ordered history.

---

## Routes

| Route | Description |
|---|---|
| `/` | Home — greets logged-in user |
| `/register` | Create account |
| `/login` | Sign in |
| `/basket` | Protected — redirects to `/login` if no session |
| `/checkout` | Protected |
| `/orders` | Protected |
