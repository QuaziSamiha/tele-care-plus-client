Here's the prompt:

---

I have an existing **Next.js frontend project** that I want to elevate to a **senior-engineer-grade, production-ready codebase**. Your job is to act as a **principal frontend engineer** performing a full architectural overhaul — not a surface-level refactor.

Before making any changes, **thoroughly read and analyze the entire existing codebase** — every page, component, hook, utility, API call, state management logic, styling pattern, config file, and folder structure. Do not assume anything; derive every decision strictly from what already exists.

---

**⚠️ GLOBAL ENFORCEMENTS — NON-NEGOTIABLE ACROSS ALL FILES**

- Always write every comment in the format `//* COMMENT` where every letter is **fully UPPERCASED**
- Always use `yarn add <package>` and `yarn add -D <package>` — never `npm install`
- Never break existing functionality — every refactor must be backward compatible unless explicitly told otherwise
- Never introduce a pattern, library, or abstraction that isn't justified by the project's actual scale and complexity
- Always follow **Next.js App Router conventions** unless the project uses Pages Router — detect and respect whichever is present
- Never mix server and client component patterns incorrectly — always place `"use client"` only where strictly necessary

---

**Phase 1 — Deep Codebase Audit**

Before writing a single line of code, produce a structured audit report covering:

- **Architecture assessment** — current folder structure, routing strategy, component boundaries, separation of concerns violations
- **Component quality issues** — business logic leaking into UI components, missing abstractions, oversized components that should be split
- **Data fetching patterns** — misuse of client-side fetching where server components could be used, missing loading/error boundaries, no caching strategy
- **State management review** — prop drilling, unnecessary global state, missing or misused context, no clear client state ownership
- **Styling consistency** — mixed styling approaches, non-reusable style patterns, missing design token usage
- **Type safety gaps** — missing or weak TypeScript types, use of `any`, untyped API responses, missing Zod or similar runtime validation
- **Performance issues** — missing `dynamic()` imports, unoptimized images not using `next/image`, missing `Suspense` boundaries, layout shift risks
- **Developer experience gaps** — missing path aliases, no barrel exports, inconsistent naming conventions, poor or missing JSDoc
- **Security concerns** — exposed secrets in client components, missing input sanitization, unprotected routes
- **Accessibility gaps** — missing ARIA attributes, non-semantic HTML, keyboard navigation issues

For each issue found, rate severity as `CRITICAL`, `MAJOR`, or `MINOR` and provide a one-line fix summary.

---

**Phase 2 — Target Architecture Design**

Based on the audit, propose a **definitive folder structure** following modern Next.js best practices:

- Clear separation of `app/` routing layer from business logic
- `components/ui/` for primitives, `components/shared/` for cross-feature components, `components/features/<feature>/` for feature-scoped components
- `lib/` for third-party client initializations
- `services/` or `api/` for all data fetching and API abstraction layers
- `hooks/` for all custom React hooks
- `store/` or `context/` for global state with clear ownership rules
- `types/` for all shared TypeScript interfaces, types, and Zod schemas
- `utils/` for pure utility functions
- `constants/` for all magic strings, enums, and static config
- `config/` for environment variable access with full type safety

Present the proposed structure as a complete annotated directory tree before touching any code.

---

**Phase 3 — Implementation Roadmap**

Break the full refactor into clearly ordered, dependency-aware tasks. For each task specify:

- What is being changed and why
- Which files are affected
- What the before/after looks like at a high level
- Whether it is a **safe isolated refactor** or requires **coordinated changes across multiple files**

Execute tasks in this priority order:
1. Foundation — TypeScript strict mode, path aliases, environment config type safety
2. API layer — centralized `fetch` wrapper or Axios instance, typed response schemas with Zod, error handling
3. Component architecture — split oversized components, enforce server vs client boundary correctly
4. State management — eliminate prop drilling, consolidate global state, remove redundant context
5. Performance — lazy loading, image optimization, Suspense boundaries, route-level code splitting
6. Styling — enforce design token usage, eliminate inline styles, create reusable style utilities
7. Developer experience — barrel exports, JSDoc on all exported functions and components, consistent naming
8. Testing foundation — set up Vitest or Jest + React Testing Library, write tests for critical utilities and hooks

---

**Phase 4 — Modern Patterns to Enforce**

Apply the following without exception where applicable:

- **Server Components by default** — only opt into `"use client"` for interactivity or browser APIs
- **`next/image`** for every image with proper `sizes`, `priority`, and `alt` attributes
- **`next/font`** for all font loading — no Google Fonts `<link>` tags in `<head>`
- **Route Groups** `(group)` for layout isolation without affecting URL structure
- **Parallel Routes and Intercepting Routes** where UI complexity justifies it
- **Zod schemas** for all form validation and all API response parsing
- **React Hook Form** if forms exist — never raw controlled inputs for complex forms
- **Absolute imports** via `tsconfig.json` `paths` — no `../../..` relative hell
- **Barrel exports** (`index.ts`) at every feature and shared component boundary
- **Error boundaries** at page and feature level with user-friendly fallback UI
- **Loading UI** (`loading.tsx`) at every route segment that fetches data
- **Middleware** for auth route protection — never client-side-only route guards
- **Environment variables** accessed only through a typed, validated `config` object — never `process.env` scattered inline

---

**Phase 5 — Documentation Standards**

- Every exported function, hook, component, and type must have a **JSDoc block** with `@param`, `@returns`, and `@example` where applicable
- Every non-obvious decision must have an inline `//* UPPERCASE EXPLANATION` comment
- `README.md` must be updated with: project structure overview, environment setup, available scripts, architecture decisions, and contribution guidelines
- Complex data flows must have a short **architecture decision record (ADR)** comment block at the top of the relevant file

---

**Execution Rules:**

- Work **phase by phase** — do not jump ahead without completing and confirming the current phase
- After each phase, present a **summary of what was done** and **what comes next** before proceeding
- If a decision has multiple valid approaches, present the options with trade-offs and wait for confirmation before implementing
- Never delete existing code without explicitly showing what replaces it and why
- All new packages installed must use `yarn add` or `yarn add -D`

---

**Output for Phase 1:** Begin immediately with the full audit report. Do not write any code until the audit is complete and reviewed.