<details>
  <summary><b>Prompt</b></summary>

I am working on a **Next.js** project and need a clean, scalable **environment configuration setup** with proper `next/image` domain allowlist support across multiple environments and developer workflows.

Set up the following structure and files **strictly following Next.js conventions** — do not use any third-party env management libraries unless already present in the project:

---

**Task 1 — Environment Files Setup**

Create the following `.env` files with appropriate variables for each context:

| File                     | Purpose                                                                                      |
| ------------------------ | -------------------------------------------------------------------------------------------- |
| `.env.development.local` | **Developer A** — uses their own personal local database                                     |
| `.env.development`       | **Developer B** (or shared dev) — develops the project at a given time, shared config        |
| `.env.office`            | Office/internal development environment — points to office/shared dev server DB and services |
| `.env.production`        | Production — live database URL, live API endpoints, all secrets placeholder-commented        |

Each file must include at minimum:

- `NEXT_PUBLIC_API_BASE_URL`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET` (set to the correct label per environment)
- `NEXTAUTH_SECRET`
- `NEXTAUTH_UR`
- Any `NEXT_PUBLIC_*` variables needed for `next/image` remote domain configuration
- Clear inline comments distinguishing each file's purpose

---

**Task 2 — next/image Remote Patterns Config**

In `next.config.js` (or `next.config.ts`), configure `images.remotePatterns` (not the deprecated `domains` array) so that:

- **Development / office** environments allow `localhost` and internal server hostnames
- **Production** environment allows only the live CDN/image domain
- The correct pattern is selected based on `NEXT_PUBLIC_APP_ENV` or `NODE_ENV` at build time

---

**Task 3 — Custom npm/yarn Scripts**

In `package.json`, define the following scripts:

| Command             | Behavior                                                                      |
| ------------------- | ----------------------------------------------------------------------------- |
| `yarn start`        | **Must** run the production build (`next start`) — this is a hard requirement |
| `yarn dev`          | Runs with `.env.development` (Developer B / shared)                           |
| `yarn dev:local`    | Runs with `.env.development.local` (Developer A / personal local DB)          |
| `yarn dev:office`   | Runs with `.env.office` (office environment)                                  |
| `yarn build`        | Standard `next build` for production                                          |
| `yarn build:office` | Builds with office env injected                                               |

Use `env-cmd` or `dotenv-cli` only if `NODE_ENV`-based loading alone cannot satisfy the multi-env requirement — and if added, install it as a `devDependency`.

---

**Task 4 — README.md — Running Commands Reference**

Add a clearly formatted section to `README.md` titled `## Environment & Running Commands` that includes:

- A table listing every `yarn` command, the env file it uses, and its purpose
- A short note on how Developer A and Developer B should set up their local `.env.development.local` (should not be committed — confirm `.gitignore` entry)
- A warning block noting that `yarn start` runs **production mode** and requires a prior `yarn build`
- `.env*.local` and `.env.production` gitignore reminders

---

**Task 6 — Live Variable Population & Comment Convention**

For `.env.production` specifically:

- Populate **all variables with their actual live values** where they are known or can be reasonably inferred from the project context
- For any variable whose live value is **not yet available or must be kept secret**, comment it out using this exact pattern:

```
//* VARIABLE_NAME=your_live_value_here
```

- Use `//* COMMENT` style for all inline section headers and explanatory notes inside `.env.production` — do not use `#` comments in this file
- Every section must have a `//* ` header comment grouping related variables (e.g. `//* Database`, `//* Auth`, `//* Storage`, `//* Image CDN`)
- No variable should be left as an empty string — either provide a realistic live value or comment it out with `//*`

Apply the same `//* COMMENT` convention for section headers across **all other `.env` files** as well for consistency.

---

**Output:**

Return each file as a clearly labeled code block in this order:

1. `.env.development.local`
2. `.env.development`
3. `.env.office`
4. `.env.production`
5. `next.config.js` (or `.ts`)
6. `package.json` scripts section only
7. `README.md` environment section only

No prose between code blocks. Inline comments inside files are encouraged for clarity.

</details>
