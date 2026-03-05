# ServeSync+ -- Final Year Project

This is a final year project of graduating students of Adama Science and Technology University in Adama, Ethiopia.

It is an multi-sector dynamic schedule management and progress tracking system for use with many governemnt and private organizations.

## Getting Started

```bash
# clone from github
git clone https://github.com/ASTU-Final-Year/final-project.git
cd final-project

# install dependencies
bun i
```

---

```bash
# run database migrations for development using sqlite
pnpm db:generate:sqlite
pnpm db:migrate:sqlite
```

```bash
# run database migrations for production using postgres
pnpm db:generate
pnpm db:migrate
```

---

```bash
# start the development backend and frontend servers
bun dev
bun dev:backend # backend only
bun dev:frontend # frontend only
```

```bash
# start the production backend and frontend servers
bun build
bun start
bun start:backend # backend only
bun start:frontend # frontend only
```

---

Finally open [http://localhost:3000](http://localhost:3000) with your browser.

## 🚀 Tech Stack

### Frontend

- Next.js 16 (React 19)
- Tailwind CSS
- Shadcn
- Zod
- React Hook Forms
- Recharts

### Backend

- Bun runtime
- Typescript for backend and javascript for frontend.
- Drizzle ORM
- SQlite for development and PostgreSQL for production

- [@bepalo/router](https://npmjs.com/package/@bepalo/router)
- [@bepalo/jwt](https://npmjs.com/package/@bepalo/jwt)
- [@bepalo/cache](https://npmjs.com/package/@bepalo/cache)
- [@bepalo/time](https://npmjs.com/package/@bepalo/time)

### ⚙️ Prerequisites

- Node.js (v18+)
- Bun — https://bun.sh
- PostgreSQL (v14+)

## 🔐 Environment Variables

```env
BUN_ENV=production
NEXT_PUBLIC_API_URL=http://localhost:4000/api
NEXT_PUBLIC_SITE_URL=http://localhost:3000

# Server

URL=http://localhost
EMAIL_DOMAIN=servesyncplus.et

## Backend

BACKEND_PORT=4000
JWT_AUTH_KEY=fSuwkiibZGgROT9gukjqBDNi-u3aRo3jhruNBvK4gfyaZfyjDzlzZY3VAexry-xa
JWT_AUTH_ALG=HS256
SALT_ROUNDS=10

## Frontend

PORT=3000

# DB
PG_DATABASE_URL="postgresql://postgres:postgres@localhost:5432/servesyncplus"
SQLITE_DATABASE_URL=".dev.db"
SUPER_ADMIN_EMAIL="super.admin@servesyncplus.et"
SUPER_ADMIN_FULLNAME="Super Admin"
SUPER_ADMIN_PASSWORD="SuperAdmin@12345"
```
