# Client-Side Storage System

## Overview

This document is the single source of truth for the client-side collection storage architecture. It covers the design decisions, implementation details, constraints, and the exact recipe for extending the system with new collection types.

---

## Core Principle

> Client-side storage is not just `localStorage.setItem`. It is a **reactive, cross-tab synchronized, SSR-safe state engine** that any component in the app can read from without prop drilling.

Three rules that follow from this:

1. **Single engine, many domains** — the hydration + sync logic lives once in a base hook. Domain hooks (`useCart`, `useWishlist`) contain only their own operations.
2. **Storage is swappable** — every consumer depends on `IStorageAdapter<T>`, not on `localStorage` directly. Switching backends requires only a new adapter file.
3. **Writes are atomic with events** — the change event is dispatched only on a successful write. A failed write (quota exceeded) never notifies listeners of a state that was never persisted.

---

## File Map

```
src/
├── lib/
│   └── storage/
│       ├── storage.interface.ts          ← IStorageAdapter<T> contract
│       ├── localStorage.adapter.ts       ← LocalStorageAdapter<T>   — persistent, cross-tab
│       ├── sessionStorage.adapter.ts     ← SessionStorageAdapter<T> — tab-scoped, no cross-tab
│       ├── cookie.adapter.ts             ← CookieAdapter<T>         — server-readable, 4 KB limit
│       └── index.ts                      ← barrel export (all three adapters + interface)
│
├── hooks/
│   └── storage/
│       └── useStorageCollection.ts       ← generic hydration + sync engine (accepts any IStorageAdapter<T>)
│
└── modules/
    ├── wishlist/
    │   └── hooks/
    │       └── useWishlist.ts            ← thin domain wrapper
    └── cart/
        └── hooks/
            └── useCart.ts               ← thin domain wrapper with totals
```

---

## Architecture Layers

```
┌─────────────────────────────────────────────────────┐
│  Layer 3 — Domain Hooks                             │
│  useWishlist · useCart                              │
│  Domain-specific operations only.                  │
│  Zero storage or sync logic.                       │
└─────────────────────────────────────────────────────┘
                          ↑
┌─────────────────────────────────────────────────────┐
│  Layer 2 — Base Hook                                │
│  useStorageCollection<T>                       │
│  Accepts any IStorageAdapter<T> implementation.    │
│  Hydration · same-tab sync · cross-tab sync        │
│  Knows nothing about wishlists or carts.            │
└─────────────────────────────────────────────────────┘
                          ↑
┌─────────────────────────────────────────────────────┐
│  Layer 1 — Storage Adapters                         │
│  IStorageAdapter<T>          interface / contract   │
│  LocalStorageAdapter<T>      persistent, cross-tab  │
│  SessionStorageAdapter<T>    tab-scoped, no persist │
│  CookieAdapter<T>     server-readable, 4 KB  │
│  read() · write() · eventName                      │
└─────────────────────────────────────────────────────┘
```

---

## Design Decisions

Three architectural decisions underpin the entire storage system. Understanding these decisions explains why the code is structured the way it is — and why deviating from them breaks something specific.

---

### 1. Adapter Pattern — Storage Backend Is Swappable

Every consumer in the codebase depends on `IStorageAdapter<T>`, not on `LocalStorageAdapter<T>` directly. This distinction is the entire point of the adapter pattern: the interface is stable; the implementation behind it is replaceable.

```ts
// useStorageCollection accepts any IStorageAdapter<T> — localStorage, sessionStorage, cookie, or custom
export const useStorageCollection = <T>(adapter: IStorageAdapter<T>) => { ... }
```

**What swapping looks like in practice:**

```ts
// Today — localStorage
const adapter = new LocalStorageAdapter<ICartItem>("thp:cart", "thp:cart:change");

// Tomorrow — IndexedDB, without touching useCart, useStorageCollection, or any component
class IndexedDBAdapter<T> implements IStorageAdapter<T> {
  read(): T[] { ... }
  write(items: T[]): void { ... }
  get eventName(): string { ... }
}
const adapter = new IndexedDBAdapter<ICartItem>("thp:cart", "thp:cart:change");
```

No consumer changes. No hook changes. No component changes. Only the adapter file is replaced.

**This is not theoretical.** Real-world reasons to swap the backend:
- Safari's aggressive localStorage eviction policy in ITP → migrate to IndexedDB
- Server-side persistence for logged-in users → `ServerSyncAdapter` that writes to the API
- Testing → an in-memory adapter with no browser dependency

If consumers depended on `LocalStorageAdapter` directly, every one of them would need to be updated when the backend changes. The interface is the firewall that prevents that.

---

### 2. Encapsulation — Co-located Interface and Barrel Export

The interface and its implementation live in the same folder. The folder exposes exactly one public surface via a barrel `index.ts`. Consumers never import from internal paths.

```
src/lib/storage/
├── storage.interface.ts    ← IStorageAdapter<T> — the contract
├── localStorage.adapter.ts ← LocalStorageAdapter<T> — the implementation
└── index.ts                ← the only file consumers are allowed to import from
```

**Why co-location is correct here:**

The interface `IStorageAdapter<T>` describes exactly what `LocalStorageAdapter<T>` must provide. They are two sides of the same module — the contract and the fulfillment. Separating them into different folders (e.g., moving the interface to `src/types/`) would mean:

- A developer reading `localStorage.adapter.ts` has to look in a different directory to find what it implements
- The `src/types/` folder accumulates storage-specific vocabulary that belongs to the storage module, not to shared global types
- The module loses its self-contained boundary

**Why the barrel matters:**

```ts
// CORRECT — import from the barrel
import { LocalStorageAdapter } from "@/lib/storage";

// WRONG — import from an internal path
import { LocalStorageAdapter } from "@/lib/storage/localStorage.adapter";
```

If `localStorage.adapter.ts` is ever renamed, split, or reorganized, only `index.ts` changes. Every consumer import remains valid. The barrel is the public API contract of the module — internal file structure is an implementation detail that only `index.ts` is allowed to know about.

---

### 3. Domain Isolation — `lib/storage` Has No Domain Knowledge

The storage module (`lib/storage`) knows nothing about carts, wishlists, or any business concept. It knows only about reading and writing arrays of `T`.

Domain modules own their adapters:

```ts
// src/modules/cart/hooks/useCart.ts
const adapter = new LocalStorageAdapter<ICartItem>("thp:cart", "thp:cart:change");

// src/modules/wishlist/hooks/useWishlist.ts
const adapter = new LocalStorageAdapter<IWishlistItem>("thp:wishlist", "thp:wishlist:change");
```

The storage module never imports from `modules/`. The dependency arrow points one way only:

```
modules/cart      →  hooks/storage/useStorageCollection  →  lib/storage
modules/wishlist  →  hooks/storage/useStorageCollection  →  lib/storage
```

**Why this boundary matters:**

If `lib/storage` imported cart types to handle cart-specific logic, adding a new collection (recently-viewed, compare list, saved addresses) would require modifying `lib/storage`. A module that must be edited every time a new feature is added is a bottleneck, not infrastructure.

With domain isolation, `lib/storage` is finished code. It never needs to change to support new collections. Each domain module brings its own key, event name, and item type — the infrastructure simply stores whatever it receives.

**Practical consequence:** If a developer asks "where is the cart storage key defined?", the answer is `src/modules/cart/hooks/useCart.ts` — not `lib/storage`. Each module is the authority on its own storage configuration.

---

## Layer 1 — Storage Adapter

### `IStorageAdapter<T>` — The Contract

`src/lib/storage/storage.interface.ts`

```ts
export interface IStorageAdapter<T> {
  read(): T[];
  write(items: T[]): void;
  readonly eventName: string;
}
```

Three members, nothing more. This is deliberately minimal — the interface describes what the base hook needs to operate, not everything a storage system could ever do.

**Why an interface at all?**

The base hook `useStorageCollection` only depends on this interface, not on `LocalStorageAdapter` concretely. This means:

```ts
//* SWAP THE STORAGE BACKEND WITHOUT TOUCHING ANY HOOK OR COMPONENT
class IndexedDBAdapter<T> implements IStorageAdapter<T> { ... }
class SessionStorageAdapter<T> implements IStorageAdapter<T> { ... }
class ServerSyncAdapter<T> implements IStorageAdapter<T> { ... }
```

Any of these can be passed to `useStorageCollection` with zero changes to the consuming code.

**Naming convention: `.interface.ts` vs `.adapter.ts`**

The file suffix must match what the file contains:

| File contents                          | Correct suffix  |
| -------------------------------------- | --------------- |
| Interface / contract only              | `.interface.ts` |
| Concrete class implementing an adapter | `.adapter.ts`   |
| Types and interfaces mixed             | `.types.ts`     |

Naming `storage.interface.ts` as `storage.adapter.ts` would be misleading — someone reading the codebase would expect `storage.adapter.ts` to contain the `LocalStorageAdapter` class, not its contract.

---

### `LocalStorageAdapter<T>` — The Implementation

`src/lib/storage/localStorage.adapter.ts`

```ts
export class LocalStorageAdapter<T> implements IStorageAdapter<T> {
  constructor(
    private readonly key: string,
    private readonly changeEvent: string,
  ) {}
```

The constructor takes two strings:

- `key` — the `localStorage` key (e.g., `"thp:wishlist"`)
- `changeEvent` — the `CustomEvent` name dispatched after a successful write (e.g., `"thp:wishlist:change"`)

Both are prefixed with `thp:` as a namespace to avoid key collisions with third-party scripts, browser extensions, and future features using the same origin.

#### `read(): T[]`

```ts
read(): T[] {
  if (typeof window === "undefined") return [];   //* SSR GUARD
  try {
    const raw = window.localStorage.getItem(this.key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}
```

Three defensive layers:

1. **SSR guard** — Next.js renders components on the server. `window` does not exist there. Without this guard, `localStorage.getItem` throws a `ReferenceError` during SSR.

2. **JSON parse safety** — `localStorage` stores plain strings. If the stored value is corrupted (manual DevTools edit, storage migration, truncated write from a crash), `JSON.parse` throws. The catch returns an empty array rather than crashing the component.

3. **Array shape validation** — `JSON.parse` can return any value. If someone manually set the key to a non-array JSON value (`"{}"`, `"42"`, `"null"`), the array cast would silently produce wrong behavior. The `Array.isArray` check returns `[]` instead.

#### `write(items: T[]): void`

```ts
write(items: T[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(this.key, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent(this.changeEvent));  //* ONLY DISPATCHED ON SUCCESS
  } catch (error) {
    if (
      error instanceof DOMException &&
      (error.name === "QuotaExceededError" ||
        error.name === "NS_ERROR_DOM_QUOTA_REACHED")
    ) {
      console.warn(
        `[LocalStorageAdapter] Storage quota exceeded for key "${this.key}". Write skipped.`,
      );
      return;
    }
    throw error;
  }
}
```

**Critical design decision — event dispatch position:**

The `CustomEvent` dispatch is inside the `try` block, _after_ `setItem`. This is intentional and non-negotiable.

```ts
//* WRONG — EVENT FIRES EVEN IF setItem THROWS
window.localStorage.setItem(this.key, JSON.stringify(items));
window.dispatchEvent(new CustomEvent(this.changeEvent)); //* OUTSIDE TRY — ALWAYS FIRES
```

In the original codebase (before this refactor), the event was dispatched unconditionally outside the try block. If `setItem` threw `QuotaExceededError`, the event still fired. Every subscribed component called `read()` and received the _previous_ (pre-write) state, but the user-visible action (adding to cart, for example) had already happened in the UI — creating a phantom UI state that was inconsistent with storage.

With the event inside `try`, a failed write produces no event. The UI does not update. The component remains in its pre-action state. The user sees the `console.warn` in DevTools and the action is a no-op.

**`QuotaExceededError` vs `NS_ERROR_DOM_QUOTA_REACHED`:**

Browsers are inconsistent on the error name:

- Chrome, Safari, modern Edge: `QuotaExceededError`
- Firefox (legacy): `NS_ERROR_DOM_QUOTA_REACHED`

Both are checked. Any other `DOMException` or non-`DOMException` error is re-thrown.

#### `eventName` getter

```ts
get eventName(): string {
  return this.changeEvent;
}
```

Exposes the change event name as a read-only property, satisfying `IStorageAdapter<T>` without leaking the private `changeEvent` field directly. The base hook uses this to subscribe and unsubscribe from the correct event.

---

---

### `SessionStorageAdapter<T>` — Tab-Scoped Implementation

`src/lib/storage/sessionStorage.adapter.ts`

```ts
export class SessionStorageAdapter<T> implements IStorageAdapter<T> {
  constructor(
    private readonly key: string,
    private readonly changeEvent: string,
  ) {}
```

The constructor takes the same two strings as `LocalStorageAdapter`. No `maxAge` parameter — sessionStorage lifetime is always tied to the tab session.

#### Key behavioral difference from `LocalStorageAdapter`

| Characteristic | `LocalStorageAdapter` | `SessionStorageAdapter` |
| --- | --- | --- |
| Data survives tab close | Yes | **No — cleared on tab close** |
| Data visible in other tabs | Yes | **No — tab-isolated** |
| Cross-tab sync via `storage` event | Yes | **No — storage event does not fire across tabs for sessionStorage** |
| Same-tab sync via `changeEvent` | Yes | Yes |
| Quota error handling | Yes | Yes — same `QuotaExceededError` names |
| SSR guard | Yes | Yes |

The base hook registers both `adapter.eventName` and the native `"storage"` event listener for every adapter. For `SessionStorageAdapter`, the `"storage"` listener is harmless but inactive — sessionStorage changes never fire it in other tabs. Same-tab sync via the custom `changeEvent` still works exactly as it does for localStorage.

#### `read(): T[]`

Identical defensive layers to `LocalStorageAdapter`: SSR guard → `getItem` → null/empty check → `JSON.parse` → `Array.isArray` guard → graceful `catch` returning `[]`.

#### `write(items: T[]): void`

Identical to `LocalStorageAdapter`: `setItem` inside `try` → dispatch `CustomEvent` only on success → catch `QuotaExceededError` and `NS_ERROR_DOM_QUOTA_REACHED` with a `console.warn` → re-throw any other error. The atomic event guarantee is preserved.

#### When to use `SessionStorageAdapter`

```ts
// CORRECT USE CASES
const adapter = new SessionStorageAdapter<ICheckoutDraft>(
  "thp:checkout-draft",
  "thp:checkout-draft:change",
);
// ↑ multi-step checkout where abandoning the tab should reset progress

const adapter = new SessionStorageAdapter<IActiveFilter[]>(
  "thp:active-filters",
  "thp:active-filters:change",
);
// ↑ filter state that should reset on each new browsing session

// WRONG USE CASES — USE LocalStorageAdapter INSTEAD
// cart, wishlist, user preferences — these must persist across sessions
```

---

### `CookieAdapter<T>` — Server-Readable Implementation

`src/lib/storage/cookie.adapter.ts`

```ts
export class CookieAdapter<T> implements IStorageAdapter<T> {
  constructor(
    private readonly key: string,
    private readonly changeEvent: string,
    private readonly maxAge: number = 60 * 60 * 24 * 7, // default: 7 days
  ) {}
```

The constructor takes an optional third parameter `maxAge` (in seconds). This is the only adapter with a lifetime parameter — both `localStorage` and `sessionStorage` manage their own lifetime at the browser level.

- Pass `0` to create a **session cookie** (expires when the browser closes)
- Pass `60 * 60 * 24 * 365` for a **one-year persistent cookie**
- Omit for the **7-day default**

#### Key behavioral differences from `LocalStorageAdapter`

| Characteristic | `LocalStorageAdapter` | `CookieAdapter` |
| --- | --- | --- |
| Readable on the server (proxy/middleware) | No | **Yes — sent with every HTTP request** |
| Size limit | ~5–10 MB | **~4096 bytes total (key + value + attributes)** |
| Write failure detection | Throws `QuotaExceededError` | **Silent — browser ignores oversized writes, no error** |
| Cross-tab sync | Via native `storage` event | **No — cookies have no `storage` event** |
| Same-tab sync | Via `changeEvent` | Via `changeEvent` |
| Sent with HTTP requests | No | **Yes — adds overhead to every server call** |
| Configurable lifetime | No (persists indefinitely) | **Yes — via `maxAge` constructor parameter** |

#### `read(): T[]`

```ts
read(): T[] {
  if (typeof document === "undefined") return [];  // SSR guard — document not window
  try {
    const match = document.cookie
      .split("; ")
      .find((entry) => entry.startsWith(`${this.key}=`));
    if (!match) return [];
    const raw = decodeURIComponent(match.split("=").slice(1).join("="));
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T[]) : [];
  } catch {
    return [];
  }
}
```

Two differences from `LocalStorageAdapter.read()`:

1. **SSR guard checks `document` instead of `window`** — `document.cookie` is the cookie API surface; checking `window` would still throw on `document.cookie` access.

2. **Cookie value extraction uses `.slice(1).join("=")`** — A cookie string looks like `key=value`. Splitting on `"="` and re-joining with `.slice(1).join("=")` safely handles values that contain `"="` characters, which both JSON and `encodeURIComponent` produce.

#### `write(items: T[]): void`

```ts
write(items: T[]): void {
  if (typeof document === "undefined") return;
  try {
    const serialized = encodeURIComponent(JSON.stringify(items));
    document.cookie = [
      `${this.key}=${serialized}`,
      `max-age=${this.maxAge}`,
      "path=/",
      "SameSite=Lax",
    ].join("; ");
    window.dispatchEvent(new CustomEvent(this.changeEvent));
  } catch (error) {
    if (error instanceof DOMException) {
      console.warn(`[CookieAdapter] Failed to write cookie ...`);
      return;
    }
    throw error;
  }
}
```

**Critical difference — silent write failure:**

Unlike `localStorage.setItem`, which throws `QuotaExceededError` when storage is full, `document.cookie` assignment is silent when the value exceeds ~4096 bytes. The browser ignores the write without throwing. This means the `changeEvent` is dispatched **optimistically** — it fires after the `document.cookie` assignment regardless of whether the write actually succeeded.

```ts
//* IF THE SERIALIZED VALUE EXCEEDS ~4096 BYTES, THE BROWSER SILENTLY IGNORES THE WRITE.
//* THE changeEvent IS STILL DISPATCHED — THE HOOK RE-READS THE COOKIE AND GETS THE OLD VALUE.
//* RESULT: THE UI STAYS AT THE PREVIOUS STATE. NO CRASH, BUT NO VISIBLE ERROR EITHER.
//* IF VERIFICATION IS REQUIRED, CALL read() IMMEDIATELY AFTER write() AND COMPARE.
```

**Cookie attributes written on every `write()`:**

| Attribute | Value | Reason |
| --- | --- | --- |
| `max-age` | `this.maxAge` | Controls cookie lifetime in seconds |
| `path=/` | `/` | Cookie is available on all routes, not just the current path |
| `SameSite=Lax` | `Lax` | Blocks cross-site request forgery; cookie is sent on same-site navigations |

`HttpOnly` is intentionally absent — `HttpOnly` cookies are invisible to JavaScript. This adapter reads and writes via `document.cookie`, which requires the cookie to be readable client-side.

#### When to use `CookieAdapter`

```ts
// CORRECT USE CASES
const adapter = new CookieAdapter<IThemePreference>(
  "thp:theme",
  "thp:theme:change",
  60 * 60 * 24 * 365,  // 1 year — theme should persist
);
// ↑ theme/locale the proxy needs to read to render the correct layout on first request

const adapter = new CookieAdapter<IConsentFlags>(
  "thp:consent",
  "thp:consent:change",
);
// ↑ GDPR consent flags — must be readable by middleware before rendering

// WRONG USE CASES — USE LocalStorageAdapter INSTEAD
// cart, wishlist, recently-viewed — these are arrays that will quickly exceed 4 KB
```

---

### Adapter Comparison Table

| Characteristic | `LocalStorageAdapter` | `SessionStorageAdapter` | `CookieAdapter` |
| --- | --- | --- | --- |
| Backed by | `window.localStorage` | `window.sessionStorage` | `document.cookie` |
| Size limit | ~5–10 MB | ~5–10 MB | ~4096 bytes |
| Persists on tab close | Yes | No | Depends on `maxAge` |
| Readable on server / proxy | No | No | Yes |
| Cross-tab sync | Yes (native `storage` event) | No | No |
| Same-tab sync | Yes (custom `changeEvent`) | Yes | Yes |
| Write failure detection | Throws `QuotaExceededError` | Throws `QuotaExceededError` | Silent — no error thrown |
| Extra constructor param | — | — | `maxAge` (seconds) |
| Use for | Cart, wishlist, large persistent data | Checkout drafts, temporary session state | Theme, consent, proxy-readable preferences |

---

### Barrel Export

`src/lib/storage/index.ts`

```ts
export type { IStorageAdapter }    from "./storage.interface";
export { LocalStorageAdapter }     from "./localStorage.adapter";
export { SessionStorageAdapter }   from "./sessionStorage.adapter";
export { CookieAdapter }        from "./cookie.adapter";
```

All consumers import from `@/lib/storage`, not from internal file paths:

```ts
//* CORRECT — IMPORT FROM BARREL
import { LocalStorageAdapter }   from "@/lib/storage";
import { SessionStorageAdapter } from "@/lib/storage";
import { CookieAdapter }  from "@/lib/storage";
import type { IStorageAdapter }  from "@/lib/storage";

//* WRONG — IMPORT FROM INTERNAL PATH (BRITTLE TO REFACTORS)
import { LocalStorageAdapter } from "@/lib/storage/localStorage.adapter";
```

If the internal file structure changes (a file is split, moved, or renamed), only `index.ts` needs updating. No consumer import breaks.

---

## Layer 2 — Base Hook

`src/hooks/storage/useStorageCollection.ts`

```ts
"use client";

import { useEffect, useState } from "react";
import type { IStorageAdapter } from "@/lib/storage";

export const useStorageCollection = <T>(
  adapter: IStorageAdapter<T>,
): { items: T[]; isHydrated: boolean; count: number } => {
  const [{ items, isHydrated }, setStorageState] = useState<{
    items: T[];
    isHydrated: boolean;
  }>({ items: [], isHydrated: false });

  useEffect(() => {
    //* STORAGE IS OUTSIDE REACT'S STATE MODEL — useEffect IS THE ONLY SAFE PLACE TO READ IT.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStorageState({ items: adapter.read(), isHydrated: true });

    //* PULL MODEL — sync READS FRESH FROM STORAGE; CUSTOM EVENTS CARRY NO PAYLOAD.
    const sync = (): void =>
      setStorageState({ items: adapter.read(), isHydrated: true });

    window.addEventListener(adapter.eventName, sync); //* SAME-TAB WRITES
    window.addEventListener("storage", sync);          //* CROSS-TAB WRITES (localStorage ONLY)

    return () => {
      window.removeEventListener(adapter.eventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, [adapter]);

  return { items, isHydrated, count: items.length };
};
```

### What this hook owns

This hook owns exactly one thing: keeping `items` state in sync with the storage backend — at mount, after every write in the current tab, and after every write in another tab (for adapters that support it). It knows nothing about carts, wishlists, or what `T` is.

### The hydration gap and `isHydrated`

Next.js renders components on the server. On the server, `localStorage` does not exist, so the initial `useState<T[]>([])` produces an empty array. After the component mounts on the client, `useEffect` fires and reads the real data.

This creates a **hydration gap**: there is a brief window (the first render after mount) where `items` is empty even though localStorage has data. `isHydrated` tracks whether the first `read()` has completed.

**How consumers use it:**

```tsx
const { items, isHydrated, count } = useWishlist();

if (!isHydrated) return <WishlistSkeleton />; //* PREVENTS EMPTY FLASH
return <WishlistGrid items={items} />;
```

Without `isHydrated`, a user with 20 items saved would see an empty wishlist flash before the data appears.

### The two sync mechanisms

The hook registers two separate event listeners for two separate sync scenarios:

| Event                | Fires in         | Triggered by                                                  |
| -------------------- | ---------------- | ------------------------------------------------------------- |
| Custom `changeEvent` | Current tab only | `adapter.write()` dispatch — works for all three adapters     |
| Native `"storage"`   | All other tabs   | Browser, on any `localStorage.setItem` — localStorage only   |

**Why two listeners are needed:**

The native `storage` event is specifically designed for cross-tab communication — it fires in every tab _except_ the one that made the write. Without the custom event, the current tab would never react to its own writes (the cart badge would not update after adding an item).

**Cross-tab sync by adapter:**

| Adapter | Same-tab sync | Cross-tab sync |
| --- | --- | --- |
| `LocalStorageAdapter` | Yes — via `changeEvent` | Yes — via native `storage` event |
| `SessionStorageAdapter` | Yes — via `changeEvent` | No — sessionStorage is tab-isolated |
| `CookieAdapter` | Yes — via `changeEvent` | No — cookies have no `storage` event |

The `"storage"` event listener is registered for all three adapters. For `SessionStorageAdapter` and `CookieAdapter`, it is inactive but harmless — those backends never trigger it.

### The adapter stability requirement

`adapter` appears in the `useEffect` dependency array. React will re-run the effect — adding and removing listeners — if the reference changes between renders.

**Adapters must always be module-level constants — this rule applies to all three adapters:**

```ts
//* CORRECT — DEFINED ONCE AT MODULE SCOPE, STABLE REFERENCE
//* WORKS THE SAME WAY FOR LocalStorageAdapter, SessionStorageAdapter, AND CookieAdapter
const adapter = new LocalStorageAdapter<IWishlistItem>("thp:wishlist", "thp:wishlist:change");

export const useWishlist = () => {
  const { items } = useStorageCollection(adapter);
  ...
};
```

```ts
//* WRONG — RECREATED ON EVERY RENDER, NEW REFERENCE EACH TIME
export const useWishlist = () => {
  const adapter = new LocalStorageAdapter<IWishlistItem>(...);  //* NEW INSTANCE EVERY RENDER
  const { items } = useStorageCollection(adapter);         //* EFFECT RE-RUNS EVERY RENDER
  ...
};
```

In the wrong pattern, each render creates a new adapter instance. React sees a different reference in deps and re-runs the effect: removes the old listeners, adds new ones, re-reads storage, re-sets state — which triggers another render. This is an infinite loop.

---

## Layer 3 — Domain Hooks

Domain hooks are thin. Their only job is to define the operations unique to their domain using the `items` state and `adapter` from the base hook. They contain zero hydration logic and zero event listener code.

### `useWishlist`

`src/modules/wishlist/hooks/useWishlist.ts`

```ts
const adapter = new LocalStorageAdapter<IWishlistItem>(
  "thp:wishlist",
  "thp:wishlist:change",
);

export const useWishlist = () => {
  const { items, isHydrated, count } = useStorageCollection(adapter);
  ...
};
```

**Public API:**

| Return value             | Type                               | Description                                      |
| ------------------------ | ---------------------------------- | ------------------------------------------------ |
| `items`                  | `IWishlistItem[]`                  | Reactive array, always in sync with storage      |
| `isHydrated`             | `boolean`                          | `false` until first `read()` completes on client |
| `count`                  | `number`                           | `items.length` — total saved items               |
| `isInWishlist(id)`       | `(id: number) => boolean`          | Membership check                                 |
| `addToWishlist(item)`    | `(item: IWishlistItem) => void`    | Adds if not already present                      |
| `removeFromWishlist(id)` | `(id: number) => void`             | Removes by id                                    |
| `toggleWishlist(item)`   | `(item: IWishlistItem) => boolean` | Adds/removes; returns new state                  |
| `clearWishlist()`        | `() => void`                       | Empties the list                                 |

**`toggleWishlist` return value:**

`toggleWishlist` returns `true` if the item was added, `false` if it was removed. This allows the calling component to display the correct toast without maintaining its own "was it added or removed" state:

```ts
const added = toggleWishlist(item);
toast(added ? "Added to wishlist" : "Removed from wishlist");
```

**Why operations call `adapter.read()` directly instead of using `items`:**

All mutation operations (`addToWishlist`, `removeFromWishlist`, `toggleWishlist`) call `adapter.read()` at the start of the operation rather than closing over `items` from state.

```ts
//* READS FRESH FROM STORAGE — NOT FROM STALE items STATE
const addToWishlist = useCallback((item: IWishlistItem) => {
  const current = adapter.read();
  if (current.some((entry) => entry.id === item.id)) return;
  adapter.write([{ ...item, addedAt: new Date().toISOString() }, ...current]);
}, []); //* EMPTY DEPS — adapter IS MODULE-LEVEL, STABLE
```

If the operation closed over `items` from state (by including `items` in deps), a rapid double-click could close over a stale snapshot: both clicks see the item as absent, both add it, and the item ends up duplicated. Reading fresh from storage before every write is the race-safe pattern.

---

### `useCart`

`src/modules/cart/hooks/useCart.ts`

`useCart` follows the same thin wrapper pattern with two additional concepts:

#### `buildCartKey` — Composite Item Identity

```ts
const buildCartKey = (productId: number, variantId?: number) =>
  `${productId}${variantId ? `:${variantId}` : ""}`;
```

A product with variants (size S/M/L) must allow the same `productId` to exist multiple times in the cart — once per variant. The cart item `id` is the composite `"productId:variantId"` string. When no variant exists, it is simply `"productId"`.

This means two cart entries with the same `productId` but different `variantId` are treated as distinct items (different row in the cart), while re-adding the same `productId` + `variantId` increments the quantity of the existing row.

#### `effectivePrice` — Sale Price Guard

```ts
//* SALE PRICE WINS ONLY WHEN IT IS A POSITIVE NUMBER STRICTLY BELOW BASE PRICE.
//* GUARDS AGAINST salePrice: 0 OR salePrice >= basePrice FROM MALFORMED API DATA.
const effectivePrice = (item: ICartItem) =>
  typeof item.salePrice === "number" &&
  item.salePrice > 0 &&
  item.salePrice < item.basePrice
    ? item.salePrice
    : item.basePrice;
```

Three conditions must all be true for the sale price to be used:

1. `salePrice` is a `number` (not `undefined`, not `null`, not a string)
2. `salePrice > 0` (not a free-item sentinel)
3. `salePrice < basePrice` (it actually represents a discount, not a markup from bad data)

If any condition fails, `basePrice` is used. This prevents a malformed API response (`salePrice: 0`, `salePrice: 9999`) from incorrectly affecting totals.

#### `addToCart` — Quantity Merge Logic

When the same item (same composite key) is added again, the existing entry's quantity is incremented rather than creating a duplicate:

```ts
const existingIdx = current.findIndex((entry) => entry.id === id);

if (existingIdx >= 0) {
  const next = [...current];
  next[existingIdx] = {
    ...next[existingIdx],
    quantity: next[existingIdx].quantity + qty,
  };
  adapter.write(next);
  return;
}
```

The spread `[...current]` creates a new array before the mutation. Mutating `current` directly would modify the parsed storage data in place, which is a subtle reference bug.

#### `totals` — `useMemo` for Derived State

```ts
const totals = useMemo(() => {
  const subtotal = items.reduce(
    (acc, item) => acc + item.basePrice * item.quantity,
    0,
  );
  const payable = items.reduce(
    (acc, item) => acc + effectivePrice(item) * item.quantity,
    0,
  );
  const discount = Math.max(0, subtotal - payable);
  const deliveryCharge = items.length > 0 ? 5 : 0;
  const estimatedTotal = payable + deliveryCharge;
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);
  return { subtotal, discount, deliveryCharge, estimatedTotal, totalQuantity };
}, [items]);
```

`totals` is derived from `items` — it has no independent state. `useMemo` ensures the five totals are only recalculated when `items` changes. Without `useMemo`, every component render (including renders caused by unrelated state) would recompute the entire cart total.

`Math.max(0, subtotal - payable)` prevents a negative discount if `effectivePrice` ever returns more than `basePrice` due to a data edge case.

**Public API:**

| Return value              | Type          | Description                                        |
| ------------------------- | ------------- | -------------------------------------------------- |
| `items`                   | `ICartItem[]` | Reactive array, in sync with storage               |
| `isHydrated`              | `boolean`     | `false` until first `read()` completes             |
| `count`                   | `number`      | Number of distinct line items (not total quantity) |
| `totalQuantity`           | `number`      | Sum of all item quantities                         |
| `subtotal`                | `number`      | Sum of `basePrice × quantity` for all items        |
| `discount`                | `number`      | `subtotal - payable` (always ≥ 0)                  |
| `deliveryCharge`          | `number`      | `5` if cart has items, `0` if empty                |
| `estimatedTotal`          | `number`      | `payable + deliveryCharge`                         |
| `addToCart(item)`         | function      | Adds or merges quantity                            |
| `updateQuantity(id, qty)` | function      | Updates quantity; no-op for `qty < 1`              |
| `removeFromCart(id)`      | function      | Removes by composite key                           |
| `clearCart()`             | function      | Empties the cart                                   |

---

## Adding a New Collection

This is the complete recipe for adding any new client-side collection to this codebase.

**Step 1 — Define the item type** in your module's `types/` directory:

```ts
//* src/modules/recently-viewed/types/recentlyViewed.type.ts
import { ProductType } from "@/modules/product/types/product.type";

export interface IRecentlyViewedItem {
  id: number;
  slug: string;
  name: string;
  imageUrl: string;
  basePrice: number;
  type: ProductType;
  viewedAt: string;
}
```

**Step 2 — Create the module-level adapter** and write the hook:

```ts
//* src/modules/recently-viewed/hooks/useRecentlyViewed.ts
"use client";

import { useCallback } from "react";
import { LocalStorageAdapter } from "@/lib/storage";
import { useStorageCollection } from "@/hooks/storage/useStorageCollection";
import { IRecentlyViewedItem } from "../types/recentlyViewed.type";

const MAX_ITEMS = 20;

const adapter = new LocalStorageAdapter<IRecentlyViewedItem>(
  "thp:recently-viewed",
  "thp:recently-viewed:change",
);

export const useRecentlyViewed = () => {
  const { items, isHydrated, count } = useStorageCollection(adapter);

  const addToRecent = useCallback((item: IRecentlyViewedItem) => {
    const current = adapter.read().filter((entry) => entry.id !== item.id);
    const next = [{ ...item, viewedAt: new Date().toISOString() }, ...current];
    adapter.write(next.slice(0, MAX_ITEMS));
  }, []);

  const clearRecent = useCallback(() => {
    adapter.write([]);
  }, []);

  return { items, isHydrated, count, addToRecent, clearRecent };
};
```

That is the entire implementation. The hydration engine, cross-tab sync, and SSR safety are already handled. The hook contains only what is unique to recently-viewed items.

---

## What Not to Do

```ts
//* WRONG — module-level functions duplicated per-feature
//* If storage strategy changes, all files must be updated
const readStorage = (): IWishlistItem[] => { ... };
const writeStorage = (items: IWishlistItem[]) => { ... };

//* WRONG — event dispatches unconditionally outside the try block
//* Listeners receive stale state update even when write failed (QuotaExceededError)
window.localStorage.setItem(key, JSON.stringify(items));
window.dispatchEvent(new CustomEvent(event));  //* OUTSIDE TRY — FIRES EVEN ON FAILURE

//* WRONG — adapter created inside the hook function
//* New instance on every render → new reference in deps → effect re-runs → infinite loop
export const useWishlist = () => {
  const adapter = new LocalStorageAdapter<IWishlistItem>(...);  //* NEVER DO THIS
  ...
};

//* WRONG — operations close over items state instead of calling adapter.read()
//* Rapid writes use a stale snapshot → duplicate entries, lost updates
const addToWishlist = useCallback((item: IWishlistItem) => {
  if (items.some((entry) => entry.id === item.id)) return;  //* items MAY BE STALE
  writeStorage([item, ...items]);
}, [items]);

//* WRONG — no isHydrated check before rendering
//* Users see an empty list flash before localStorage data loads
return <WishlistGrid items={items} />;  //* items IS [] ON FIRST RENDER

//* WRONG — importing from internal file paths instead of the barrel
import { LocalStorageAdapter } from "@/lib/storage/localStorage.adapter";  //* BRITTLE
```

---

## Testing

### Manual Verification

**Same-tab sync — Cart badge updates immediately:**

```
1. Open /en/product-details/any-product
2. Click "Add to Cart"
3. Cart icon in header should increment without a page reload
```

**Cross-tab sync — Two tabs stay in sync:**

```
1. Open two browser tabs at /en/cart
2. In Tab 1: remove an item
3. Tab 2 should update automatically (no reload required)
```

**Hydration — No empty flash on page load:**

```
1. Add several items to cart / wishlist
2. Hard-reload the page (Ctrl+Shift+R)
3. The correct item count should appear without flashing "0" first
   (if isHydrated guard is missing, a "0" count flash is visible)
```

**Storage quota exhaustion:**

```
1. DevTools → Application → Storage → set localStorage quota to 1 KB
2. Add items until quota is exceeded
3. Expected: console.warn from LocalStorageAdapter, no crash, no stale event
4. Expected: the last item that failed to write does NOT appear in the list
```

**SSR — No window reference errors:**

```
yarn build
```

A `ReferenceError: window is not defined` in the build output means an SSR guard is missing in `read()` or `write()`.

---

### Automated Unit Tests

**`LocalStorageAdapter` — read / write / quota handling:**

```ts
//* src/lib/storage/__tests__/localStorage.adapter.test.ts
import { LocalStorageAdapter } from "../localStorage.adapter";

const KEY = "test:items";
const EVENT = "test:items:change";

beforeEach(() => localStorage.clear());

test("read returns empty array when key is absent", () => {
  const adapter = new LocalStorageAdapter(KEY, EVENT);
  expect(adapter.read()).toEqual([]);
});

test("read returns empty array when value is not an array", () => {
  localStorage.setItem(KEY, JSON.stringify({ not: "array" }));
  const adapter = new LocalStorageAdapter(KEY, EVENT);
  expect(adapter.read()).toEqual([]);
});

test("write persists items and dispatches event", () => {
  const adapter = new LocalStorageAdapter<{ id: number }>(KEY, EVENT);
  const handler = jest.fn();
  window.addEventListener(EVENT, handler);

  adapter.write([{ id: 1 }]);

  expect(JSON.parse(localStorage.getItem(KEY)!)).toEqual([{ id: 1 }]);
  expect(handler).toHaveBeenCalledTimes(1);
  window.removeEventListener(EVENT, handler);
});

test("write does not dispatch event when quota is exceeded", () => {
  const adapter = new LocalStorageAdapter<{ id: number }>(KEY, EVENT);
  const handler = jest.fn();
  window.addEventListener(EVENT, handler);

  jest.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
    const err = new DOMException("QuotaExceededError");
    Object.defineProperty(err, "name", { value: "QuotaExceededError" });
    throw err;
  });

  expect(() => adapter.write([{ id: 1 }])).not.toThrow();
  expect(handler).not.toHaveBeenCalled();
  window.removeEventListener(EVENT, handler);
});
```

**`useStorageCollection` — hydration and sync:**

```ts
//* src/hooks/storage/__tests__/useStorageCollection.test.ts
import { renderHook, act } from "@testing-library/react";
import { LocalStorageAdapter } from "@/lib/storage";
import { useStorageCollection } from "../useStorageCollection";

const adapter = new LocalStorageAdapter<{ id: number }>(
  "test:col",
  "test:col:change",
);

beforeEach(() => localStorage.clear());

test("starts unhydrated with empty items", () => {
  const { result } = renderHook(() => useStorageCollection(adapter));
  //* BEFORE EFFECT: still the initial state
  expect(result.current.isHydrated).toBe(false);
  expect(result.current.items).toEqual([]);
});

test("hydrates from storage after mount", async () => {
  adapter.write([{ id: 1 }, { id: 2 }]);
  const { result } = renderHook(() => useStorageCollection(adapter));
  await act(async () => {});
  expect(result.current.isHydrated).toBe(true);
  expect(result.current.items).toHaveLength(2);
  expect(result.current.count).toBe(2);
});

test("syncs when adapter.write fires the custom event", async () => {
  const { result } = renderHook(() => useStorageCollection(adapter));
  await act(async () => {});

  act(() => adapter.write([{ id: 99 }]));

  expect(result.current.items).toEqual([{ id: 99 }]);
});
```

---

### Pre-Deployment Checklist

**`LocalStorageAdapter` (cart, wishlist):**
```
□ Hard reload page with items in cart/wishlist — correct count shows with no "0" flash
□ Add item → cart badge increments immediately in same tab
□ Open two tabs, remove item in one → the other tab updates without reload
□ Build passes with no "window is not defined" error
□ DevTools → Application → Local Storage shows keys prefixed with "thp:"
```

**`SessionStorageAdapter` (checkout draft, active filters):**
```
□ Data appears correctly within the same tab session
□ Close and reopen the tab — data is gone (expected behavior, not a bug)
□ Open two tabs — each tab has independent state (no cross-tab bleed)
□ Build passes with no "window is not defined" error
□ DevTools → Application → Session Storage shows keys prefixed with "thp:"
```

**`CookieAdapter` (theme, consent):**
```
□ Data persists after tab close and browser restart (for maxAge > 0)
□ Cookie is visible to the proxy/middleware on the first request (before React mounts)
□ DevTools → Application → Cookies shows keys prefixed with "thp:" with correct max-age
□ Stored value stays well under 4096 bytes — check raw cookie size in DevTools
□ Build passes with no "document is not defined" error
```

**All adapters:**
```
□ Adding a new collection → works with zero changes to useStorageCollection
□ isHydrated guard is in place — no empty-list flash before storage is read
```

---

## Architecture Comparison — Old Utility vs New Hook System

This section documents why the hook-based system exists, using the old `localCart` utility as a concrete contrast. This is the full decision record so the reasoning is never lost.

### Old Approach — Plain Object Utility

```ts
// Structure of the old system
const localCart = {
  get()           // reads localStorage
  set(cart)       // writes + dispatches Event
  addItem(item)   // calls get() + set()
  removeItem(id)  // calls get() + set()
  clear()         // removes key + dispatches Event
}
```

No React. No state. No hooks. A plain utility you call manually.

### New Approach — Reactive Hook System

```
IStorageAdapter<T>              ← interface / contract
        ↑
LocalStorageAdapter<T>          ← read, write, eventName
        ↑
useStorageCollection<T>    ← hydration + sync engine
        ↑
useCart / useWishlist           ← domain operations only
```

React-first. State is automatic. Components re-render when storage changes.

---

### Dimension-by-Dimension Breakdown

#### 1. Reactivity

The biggest difference.

**Old:** After calling `localCart.addItem(...)`, nothing in the UI updates unless every component that displays cart data manually subscribes to the `"cart-updated"` event in its own `useEffect`. This wiring is the caller's responsibility — it is easy to forget and impossible to enforce.

**New:** After calling `addToCart(...)`, every component that calls `useCart()` re-renders automatically. The subscription is inside the base hook — it exists once and works everywhere.

#### 2. Hydration / SSR Safety

**Old:** Has the basic `if (typeof window === "undefined") return []` guard, which prevents a crash. But there is no `isHydrated` flag. A component that reads `localCart.get()` on first render gets `[]`, and has no way to know whether that `[]` is real (empty cart) or temporary (data not yet loaded from storage). The result is an empty-content flash with no mechanism to show a skeleton instead.

**New:**
```tsx
const { items, isHydrated } = useCart();
if (!isHydrated) return <CartSkeleton />;  // correct: show skeleton, not empty state
return <CartGrid items={items} />;
```
`isHydrated` is `false` until the first `adapter.read()` completes on the client. Components can distinguish "loading" from "genuinely empty."

#### 3. Cross-Tab Synchronization

**Old:** Not handled. Open two tabs, add an item in Tab 1 — Tab 2 never knows. Adding cross-tab sync would require a `window.addEventListener("storage", ...)` in every component that needs it.

**New:** The native `"storage"` event listener is registered once in `useStorageCollection`. Every domain hook gets cross-tab sync for free.

#### 4. Write Failure Handling

**Old:**
```ts
// in localCart.set()
localStorage.setItem(CART_KEY, JSON.stringify(cart)); // may throw QuotaExceededError
window.dispatchEvent(new Event("cart-updated"));       // fires regardless
```
If `setItem` throws, the event still fires. Every listener calls `get()` and reads the pre-write state — but the UI already reacted to the action. The result is a phantom state: the user sees an item that was never actually saved.

**New:** The `CustomEvent` is dispatched inside the `try` block, after `setItem`. A failed write produces no event. The UI does not update. `QuotaExceededError` is caught specifically and logged as a warning; the app does not crash.

#### 5. Type Safety

**Old has a type inconsistency:**
```ts
// ILocalCartItem declares:
price: number;

// addItem parameter declares:
price?: string;  // ← mismatch — string vs number, will produce silent bugs at runtime
```
The interface and the method signature disagree. TypeScript cannot catch this at the call site because the parameter is typed as `string` — the error only surfaces at runtime when arithmetic is attempted on a string price.

**New:** The adapter is generic (`LocalStorageAdapter<T>`). The domain hook defines `T` once as the interface, and all operations are fully typed against it. No mismatches are possible.

#### 6. Race Condition Safety

**Old `addItem` mutates the parsed array in place:**
```ts
const existing = cart.find((i: ILocalCartItem) => i.id === item.id);
if (existing) {
  existing.quantity += item.quantity; // mutates the object from JSON.parse directly
}
```
The mutation modifies the JavaScript object that `JSON.parse` returned. While this works in practice, it is a subtle anti-pattern: the array and its objects are treated as mutable references even though they came from a read operation.

**New:** All mutation operations call `adapter.read()` for a fresh snapshot, construct a new array via spread, and write that new array. The parsed data from storage is never mutated in place.

#### 7. Extensibility

| Task | Old | New |
|---|---|---|
| Add a wishlist | Copy-paste `localCart`, rename everything | 30-line hook using the existing engine |
| Add recently-viewed | Copy-paste again | Another 30-line hook |
| Switch to IndexedDB | Rewrite every utility | Implement `IStorageAdapter<T>`, pass to base hook |
| Add session storage | Rewrite every utility | `SessionStorageAdapter<T>` — one new file |

**Old scales by copy-paste.** Each new collection duplicates the get/set/event logic. When storage strategy changes (error handling, key namespacing, event model), every copy must be found and updated.

**New scales by composition.** The get/set/event logic lives once. Adding a collection means writing only the domain-specific operations.

#### 8. Event Namespacing

**Old:** `new Event("cart-updated")` — a generic name with no namespace. Any third-party script, browser extension, or future feature that also dispatches `"cart-updated"` will trigger the cart listener.

**New:** `"thp:cart:change"` — the `thp:` prefix is a namespace owned by this codebase. Third-party collisions are not possible.

#### 9. Event Type

**Old:** `new Event("cart-updated")` — base `Event`, carries no data.

**New:** `new CustomEvent(this.changeEvent)` — `CustomEvent` supports a `detail` field for carrying payload data if needed in the future. No migration required to add that capability.

#### 10. Testability

**Old:** No isolation. To test `addItem`, you must test `get()` and `set()` at the same time. Mocking requires patching the global `localStorage`.

**New:** The adapter can be constructed with any key and tested independently. The base hook is tested with `renderHook`. Domain hooks can be tested by calling operations and verifying what the adapter wrote. Each layer is independently testable.

---

### Why You Cannot Keep Both Systems in Parallel

Running both systems for the same domain (e.g., both `localCart` and `useCart` for the cart) creates three failure modes:

**1. Split events.** `localCart.set()` dispatches `"cart-updated"`. `useCart`'s adapter dispatches `"thp:cart:change"`. The two listeners do not cross. A write from one system is invisible to the other's hook.

**2. Split storage keys.** `localCart` uses `"local_cart"`. The adapter uses `"thp:cart"`. They store separate carts. An item added through `localCart` does not appear in `useCart().items`.

**3. Split storage keys (forced same key, worse).** If both are forced to the same key, `localCart` writes will fire `"cart-updated"` which `useCart`'s listener ignores. The hook's React state goes stale while localStorage has new data.

**Rule:** One system per domain. For this Next.js codebase, the hook system is the correct choice. If a plain utility is needed for a non-React context (a server script, a one-off migration), use `adapter.read()` and `adapter.write()` directly — the adapter itself has no React dependency.

---

### When the Old Pattern Is Appropriate

The old utility pattern is not wrong — it is wrong for this context. It is appropriate when:

- The consumer is not a React component (a Node.js script, a plain HTML page, a non-hook utility)
- No reactivity is needed (a one-time read on page load, a write triggered by a form submit with a full page reload)
- The project has no SSR and no multi-tab requirement

For a Next.js App Router project with reactive UI, the hook system is the only correct choice.

---

### Summary Table

| Capability | Old `localCart` | New Hook System |
|---|---|---|
| React state / auto re-render | No | Yes |
| Hydration gap / `isHydrated` | No | Yes |
| Cross-tab sync | No | Yes |
| Same-tab sync | Partially (event outside `try`) | Yes (event inside `try`, error-safe) |
| Write failure handling | No — crashes or phantom state | Yes — silent warn, no phantom event |
| Type safety / generics | Inconsistent (`price: string` vs `number`) | Full — types enforced at the adapter |
| Extensible to new collections | Copy-paste the whole utility | 30-line domain hook |
| Swappable storage backend | No | Yes — `IStorageAdapter<T>` |
| Unit testable in isolation | Partial | Full — each layer independently |
| Event namespacing | No (`"cart-updated"`) | Yes (`"thp:cart:change"`) |
| Suitable for Next.js App Router | Partial | Yes |

---

<details>
<summary>prompt</summary>
const CART_KEY = "local_cart";

export interface ILocalCartItem {
id: number;
name: string;
price: number;
comparePrice?: number;
image: string;
quantity: number;
}

export const localCart = {
get() {
//_ Checks if you are in the browser (not in Next.js server side).
if (typeof window === "undefined") {
return [];
}
const stored = localStorage.getItem(CART_KEY);
return stored ? JSON.parse(stored) : []; //_ JSON.parse : converts it from string → back to array using
/\*\*
_ If your localStorage looks like: "local_cart": "[{\"id\":1,\"name\":\"Soap\",\"price\":100,\"quantity\":2}]"
_ Then localCart.get() returns: [{ id: 1, name: "Soap", price: 100, quantity: 2 }]
\*/
},

set(cart: ILocalCartItem[]) {
if (typeof window === "undefined") return; //_ Checks if you are in the browser (not in Next.js server side).
localStorage.setItem(CART_KEY, JSON.stringify(cart));
/\*\*
_ Now your browser stores:
_ Key: "local_cart"
_ Value: "[{\"id\":1,\"name\":\"Soap\",\"price\":100,\"quantity\":2}]"
\*/
window.dispatchEvent(new Event("cart-updated"));
},

addItem(item: {
id: number;
name?: string;
price?: string;
comparePrice?: string;
image?: string;
quantity: number;
}) {
const cart = this.get(); //_ Fetches the current cart from localStorage.
const existing = cart.find((i: ILocalCartItem) => i.id === item.id); //_ Checks if the item already exists

    if (existing) {
      existing.quantity += item.quantity; //* If yes → increases the quantity.
    } else {
      cart.push(item); //* If not → adds the new product to the cart array.
    }

    this.set(cart); //* Saves the updated cart back to localStorage.

},

removeItem(id: number) {
const cart = this.get();
const updatedCart = cart.filter((i: ILocalCartItem) => i.id !== id); //_ Filter out (remove) the item that matches the given id
this.set(updatedCart); //_ Save the new array back to localStorage
},

clear() {
if (typeof window === "undefined") return;
localStorage.removeItem(CART_KEY);
window.dispatchEvent(new Event("cart-updated"));
},
}; i have this in my previous old project for maintaining local storage, what is the difference between my current project local storage handling with the previous one, which is better, pros and cons, can i keep two types for the codebase, by consider project i will use one of them, i want to know everything

</details>
