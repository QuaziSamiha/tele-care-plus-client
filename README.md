# Essence Lab

## Environment & Running Commands

### Command Reference

| Command             | Env File Loaded                      | Purpose                                                                     |
| ------------------- | ------------------------------------ | --------------------------------------------------------------------------- |
| `yarn dev`          | `.env.development`                   | Developer B shared config — standard Next.js dev server on `localhost:3000` |
| `yarn dev:local`    | `.env.development.local`             | Developer A personal local config — isolated from shared `.env.development` |
| `yarn dev:office`   | `.env.office`                        | Office/internal environment — API at `192.168.100.242:5001`                 |
| `yarn build`        | `.env.production` _(Next.js native)_ | Production build — compiles output to `.next/`                              |
| `yarn build:office` | `.env.office`                        | Office build — compiles with office env injected                            |
| `yarn start`        | _(reads compiled `.next/`)_          | **Production start** — runs `next start`. Requires `yarn build` first.      |

> **Warning:** `yarn start` serves the **compiled production build** from `.next/`.
> It does **not** compile source. Always run `yarn build` before `yarn start`, otherwise you will serve a stale or missing build.

---

### Claude

- [General Instructions](./claude-doc/GENERAL_INSTRUCTION.md)
- [env File](./claude-doc/ENV_FILE.md)

### Documentations

- [All Changes in auth module](./documentation/AUTH.md)
