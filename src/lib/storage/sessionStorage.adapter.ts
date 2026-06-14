//* ─────────────────────────────────────────────────────────────────────────────
//* FILE GOAL
//*   CONCRETE IMPLEMENTATION OF IStorageAdapter<T> BACKED BY window.sessionStorage.
//*   IDENTICAL API TO LocalStorageAdapter BUT TAB-SCOPED: DATA IS ERASED WHEN THE
//*   TAB OR BROWSER CLOSES. NO CROSS-TAB SYNC.
//*
//* WORKFLOW
//*   1. INSTANTIATE ONCE AT MODULE SCOPE IN THE DOMAIN HOOK (NOT INSIDE THE FUNCTION).
//*      const adapter = new SessionStorageAdapter<IDraft>("thp:draft", "thp:draft:change");
//*
//*   2. PASS THE INSTANCE TO useStorageCollection(adapter).
//*      THE BASE HOOK CALLS read() ON MOUNT AND SUBSCRIBES TO eventName FOR SYNC.
//*
//*   3. CALL adapter.write(newItems) FROM DOMAIN HOOK OPERATIONS TO PERSIST AND NOTIFY LISTENERS.
//*
//* USE CASES
//*   — DATA THAT MUST NOT SURVIVE A TAB CLOSE: MULTI-STEP CHECKOUT DRAFT, ACTIVE FILTERS,
//*     GUEST SESSION STATE, UNSAVED FORM PROGRESS.
//*   — DATA THAT MUST NOT BLEED ACROSS TABS: INDEPENDENT SHOPPING SESSIONS IN TWO TABS.
//*   — NEVER FOR CART OR WISHLIST — THOSE MUST PERSIST ACROSS SESSIONS. USE LocalStorageAdapter.
//*
//* CRITICAL DIFFERENCE FROM LocalStorageAdapter
//*   — TAB-SCOPED: DATA IS CLEARED WHEN THE TAB CLOSES. NOT AVAILABLE IN OTHER TABS.
//*   — NO CROSS-TAB SYNC: THE NATIVE "storage" EVENT DOES NOT FIRE FOR sessionStorage
//*     CHANGES IN OTHER TABS. ONLY SAME-TAB SYNC VIA changeEvent WORKS.
//*
//* HOW TO USE IN THE CODEBASE
//*   import { SessionStorageAdapter } from "@/lib/storage";
//*   import { useStorageCollection } from "@/hooks/storage/useStorageCollection";
//*
//*   const adapter = new SessionStorageAdapter<IDraftItem>(
//*     "thp:draft",        // sessionStorage KEY — MUST USE "thp:" PREFIX
//*     "thp:draft:change"  // CustomEvent NAME DISPATCHED AFTER EVERY WRITE
//*   );
//*
//*   export const useDraft = () => {
//*     const { items, isHydrated, count } = useStorageCollection(adapter);
//*     ...
//*   };
//* ─────────────────────────────────────────────────────────────────────────────

import type { IStorageAdapter } from "./storage.interface";

export class SessionStorageAdapter<T> implements IStorageAdapter<T> {
  //* key         — THE sessionStorage KEY (e.g. "thp:draft"). PREFIX "thp:" NAMESPACES IT TO THIS
  //*               CODEBASE AND PREVENTS COLLISIONS WITH THIRD-PARTY SCRIPTS.
  //* changeEvent — THE CustomEvent NAME DISPATCHED AFTER A SUCCESSFUL WRITE.
  constructor(
    private readonly key: string,
    private readonly changeEvent: string,
  ) {}

  read(): T[] {
    //* sessionStorage, LIKE localStorage, DOES NOT EXIST DURING SSR.
    //* WITHOUT THIS GUARD, sessionStorage.getItem THROWS ReferenceError ON THE SERVER.
    if (typeof window === "undefined") return [];
    try {
      const raw = window.sessionStorage.getItem(this.key);
      //* null  — KEY HAS NEVER BEEN WRITTEN IN THIS TAB SESSION.
      //* ""    — KEY EXISTS BUT IS EMPTY. BOTH TREATED AS AN EMPTY COLLECTION.
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      //* JSON.parse CAN RETURN ANY SHAPE — Array.isArray IS THE ONLY SAFE SHAPE GUARD.
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      //* MALFORMED JSON (CORRUPTED VALUE, MANUAL DEVTOOLS EDIT) — RECOVER GRACEFULLY.
      return [];
    }
  }

  write(items: T[]): void {
    if (typeof window === "undefined") return;
    try {
      window.sessionStorage.setItem(this.key, JSON.stringify(items));
      //* EVENT DISPATCHED ONLY AFTER A SUCCESSFUL setItem — SAME GUARANTEE AS LocalStorageAdapter.
      //* IF setItem THROWS (QUOTA EXCEEDED), THIS LINE IS NEVER REACHED.
      window.dispatchEvent(new CustomEvent(this.changeEvent));
    } catch (error) {
      //* sessionStorage SHARES THE SAME QUOTA ERROR NAMES AS localStorage.
      //* "QuotaExceededError"        — CHROME, SAFARI, MODERN EDGE.
      //* "NS_ERROR_DOM_QUOTA_REACHED" — FIREFOX (LEGACY NAME).
      if (
        error instanceof DOMException &&
        (error.name === "QuotaExceededError" ||
          error.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        console.warn(
          `[SessionStorageAdapter] Storage quota exceeded for key "${this.key}". Write skipped.`,
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
