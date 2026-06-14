//* ─────────────────────────────────────────────────────────────────────────────
//* FILE GOAL
//*   CONCRETE IMPLEMENTATION OF IStorageAdapter<T> BACKED BY document.cookie.
//*   SUITED FOR SMALL, PREFERENCE-SIZED DATA THAT MUST BE READABLE ON BOTH THE
//*   CLIENT AND THE SERVER (PROXY / MIDDLEWARE) WITHOUT A NETWORK CALL.
//*   EXAMPLES: LOCALE OVERRIDE, THEME PREFERENCE, CONSENT FLAGS, FEATURE TOGGLES.
//*
//* WORKFLOW
//*   1. INSTANTIATE ONCE AT MODULE SCOPE IN THE DOMAIN HOOK (NOT INSIDE THE FUNCTION).
//*      const adapter = new CookieAdapter<IConsent>("thp:consent", "thp:consent:change");
//*
//*   2. PASS THE INSTANCE TO useStorageCollection(adapter).
//*      THE BASE HOOK CALLS read() ON MOUNT AND SUBSCRIBES TO eventName FOR SYNC.
//*
//*   3. CALL adapter.write(newItems) FROM DOMAIN HOOK OPERATIONS TO PERSIST AND NOTIFY LISTENERS.
//*
//* USE CASES
//*   — SMALL DATA THE PROXY/MIDDLEWARE MUST READ WITHOUT A NETWORK CALL (THEME, CONSENT).
//*   — SETTINGS THAT MUST SURVIVE SESSION CLOSE (SET maxAge > 0).
//*   — NEVER FOR CART OR WISHLIST — COOKIES ARE LIMITED TO ~4096 BYTES PER KEY.
//*     LARGE COLLECTIONS WILL BE SILENTLY TRUNCATED. USE LocalStorageAdapter INSTEAD.
//*
//* CRITICAL DIFFERENCES FROM localStorage AND sessionStorage
//*   — SIZE LIMIT: ~4096 BYTES TOTAL PER COOKIE (NAME + VALUE + ATTRIBUTES).
//*     BROWSERS SILENTLY IGNORE WRITES THAT EXCEED THIS LIMIT — NO ERROR IS THROWN.
//*     THIS ADAPTER DISPATCHES THE changeEvent OPTIMISTICALLY (BEFORE VERIFYING THE WRITE).
//*     IF SILENT FAILURE MATTERS, CALL read() IMMEDIATELY AFTER write() TO VERIFY.
//*   — NO NATIVE CROSS-TAB SYNC: COOKIES HAVE NO "storage" EVENT. ONLY SAME-TAB
//*     SYNC VIA changeEvent IS AVAILABLE.
//*   — HTTP OVERHEAD: EVERY COOKIE IS SENT WITH EACH REQUEST. KEEP VALUES SMALL.
//*
//* HOW TO USE IN THE CODEBASE
//*   import { CookieAdapter } from "@/lib/storage";
//*   import { useStorageCollection } from "@/hooks/storage/useStorageCollection";
//*
//*   const adapter = new CookieAdapter<ITheme>(
//*     "thp:theme",             // COOKIE NAME — MUST USE "thp:" PREFIX
//*     "thp:theme:change",      // CustomEvent NAME DISPATCHED AFTER EVERY WRITE
//*     60 * 60 * 24 * 365       // OPTIONAL max-age IN SECONDS (DEFAULT: 7 DAYS)
//*   );
//*
//*   export const useTheme = () => {
//*     const { items, isHydrated } = useStorageCollection(adapter);
//*     ...
//*   };
//* ─────────────────────────────────────────────────────────────────────────────

import type { IStorageAdapter } from "./storage.interface";

//* 7 DAYS IN SECONDS — REASONABLE DEFAULT FOR PREFERENCE-LEVEL DATA.
const DEFAULT_MAX_AGE = 60 * 60 * 24 * 7;

export class CookieAdapter<T> implements IStorageAdapter<T> {
  //* key         — THE COOKIE NAME (e.g. "thp:theme"). PREFIX "thp:" NAMESPACES IT TO THIS CODEBASE.
  //* changeEvent — THE CustomEvent NAME DISPATCHED AFTER EVERY WRITE.
  //* maxAge      — COOKIE LIFETIME IN SECONDS. DEFAULTS TO 7 DAYS.
  //*               PASS 0 TO CREATE A SESSION COOKIE (EXPIRES WHEN BROWSER CLOSES).
  constructor(
    private readonly key: string,
    private readonly changeEvent: string,
    private readonly maxAge: number = DEFAULT_MAX_AGE,
  ) {}

  read(): T[] {
    //* document.cookie DOES NOT EXIST DURING SSR — RETURN EMPTY ARRAY BEFORE ANY ACCESS.
    if (typeof document === "undefined") return [];
    try {
      const match = document.cookie
        .split("; ")
        .find((entry) => entry.startsWith(`${this.key}=`));
      if (!match) return [];
      //* split("=").slice(1).join("=") SAFELY RECOVERS VALUES THAT CONTAIN "=" CHARACTERS.
      //* JSON + encodeURIComponent BOTH PRODUCE "=" (BASE64 PADDING) IN OUTPUT.
      const raw = decodeURIComponent(match.split("=").slice(1).join("="));
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      //* JSON.parse CAN RETURN ANY SHAPE — Array.isArray IS THE ONLY SAFE SHAPE GUARD.
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      //* MALFORMED COOKIE (EXTERNAL EDIT, ENCODING ERROR) — RECOVER GRACEFULLY.
      return [];
    }
  }

  write(items: T[]): void {
    //* document DOES NOT EXIST DURING SSR.
    if (typeof document === "undefined") return;
    try {
      //* encodeURIComponent ESCAPES CHARACTERS ILLEGAL IN COOKIE VALUES (COMMA, SEMICOLON, SPACE).
      const serialized = encodeURIComponent(JSON.stringify(items));
      //* SameSite=Lax BLOCKS THE COOKIE FROM CROSS-SITE REQUESTS (CSRF PROTECTION).
      //* path=/ MAKES THE COOKIE AVAILABLE ON ALL ROUTES, NOT JUST THE CURRENT PATH.
      //* SILENT FAILURE WARNING: IF serialized EXCEEDS ~4096 BYTES, THE BROWSER IGNORES
      //* THIS WRITE WITHOUT THROWING. THE changeEvent IS DISPATCHED OPTIMISTICALLY.
      document.cookie = [
        `${this.key}=${serialized}`,
        `max-age=${this.maxAge}`,
        "path=/",
        "SameSite=Lax",
      ].join("; ");
      window.dispatchEvent(new CustomEvent(this.changeEvent));
    } catch (error) {
      //* SecurityError CAN OCCUR IN SANDBOXED IFRAMES WHERE COOKIE ACCESS IS BLOCKED.
      if (error instanceof DOMException) {
        console.warn(
          `[CookieAdapter] Failed to write cookie for key "${this.key}". ` +
            `Cookie access may be blocked in this context.`,
        );
        return;
      }
      throw error;
    }
  }

  //* EXPOSES changeEvent AS A READ-ONLY PROPERTY TO SATISFY IStorageAdapter<T>.
  get eventName(): string {
    return this.changeEvent;
  }
}
