# AGENTS.md

## Project Architecture & Structure

- **Monorepo Layout:**
  - `backend/`: All server-side logic, API routes, database, and services.
  - `src/`: Frontend (Next.js app), including pages, components, hooks, and utilities.
  - `public/`: Static assets (e.g., images).

- **Frontend:**
  - Built with **Next.js** (React-based).
  - Main entry: `src/app/`
    - Pages and layouts organized by feature (e.g., `dashboard/`, `login/`, `register/`, `organization/`).
    - Shared UI components in `src/components/ui/`.
    - Feature-specific components in `src/app/components/` and subfolders.
    - State management in `src/store/`.

- **Backend:**
  - API routes in `backend/routes/`.
  - Database schemas in `backend/db/schema/`.
  - Service layer in `backend/services/`.
  - Middleware in `backend/middleware/`.
  - Configuration in `backend/config.ts`.

## Build/Test/Start Commands

- **Check [README.md](README.md) for up-to-date scripts.**
- Common scripts (from `package.json`):
  - `dev`: Start development server.
  - `build`: Build the project.
  - `start`: Start production server.
  - Linting: `eslint.config.mjs`
  - Database config: `drizzle.config.ts`, `drizzle.config.sqlite.ts`

## Key Conventions & Patterns

- **Naming:**
  - Folders and files use kebab-case or camelCase (e.g., `app-sidebar-client.jsx`, `organization.service.ts`).
  - Service files end with `.service.ts`.
  - API routes and middleware are grouped by feature.

- **File Organization:**
  - UI components are modular and reusable, grouped under `src/components/ui/`.
  - Feature-specific logic is colocated with pages.
  - Backend services are separated by domain (e.g., `user.service.ts`, `payment.service.ts`).

- **API Structure:**
  - RESTful endpoints under `backend/routes/`.
  - Versioning via `api/v1/`.
  - OpenAPI spec in `backend/api.doc.yml`.

## Environment & Setup Pitfalls

- Ensure Node.js and package manager (npm/yarn/pnpm) are installed.
- Database setup may require configuration—see `drizzle.config.ts` and `backend/db/`.
- Environment variables likely required for backend and frontend (not included in repo).
- Linting and formatting enforced via `eslint.config.mjs`.

## Exemplary Files/Directories

- **Frontend UI Patterns:**
  - `src/components/ui/` — Reusable UI primitives.
  - `src/app/dashboard/` — Example of feature-based page organization.

- **Backend Patterns:**
  - `backend/services/` — Service layer abstraction.
  - `backend/routes/` — API route structure.
  - `backend/db/schema/` — Database schema organization.

- **API Documentation:**
  - `backend/api.doc.yml` — OpenAPI spec for API contracts.

---

For further details, refer to [README.md](README.md) and the respective config files. This summary is intended for agent onboarding and codebase navigation.
