import type { IStorageAdapter } from "./storage.interface";

export class LocalStorageAdapter<T> implements IStorageAdapter<T> {
  //* key   — THE localStorage KEY (e.g. "thp:cart"). PREFIX "thp:" NAMESPACES IT TO THIS
  //*         CODEBASE AND PREVENTS COLLISIONS WITH THIRD-PARTY SCRIPTS OR BROWSER EXTENSIONS.
  //* changeEvent — THE CustomEvent NAME DISPATCHED AFTER A SUCCESSFUL WRITE (e.g. "thp:cart:change").
  //*              SAME-TAB LISTENERS SUBSCRIBE TO THIS EVENT TO REACT TO WRITES IN THE CURRENT TAB.
  constructor(
    private readonly key: string,
    private readonly changeEvent: string,
  ) {}

  read(): T[] {
    //* NEXT.JS EXECUTES COMPONENTS ON THE SERVER WHERE window DOES NOT EXIST.
    //* WITHOUT THIS GUARD, localStorage.getItem THROWS ReferenceError DURING SSR.
    if (typeof window === "undefined") return [];
    try {
      const raw = window.localStorage.getItem(this.key);
      //* null  — KEY HAS NEVER BEEN WRITTEN.
      //* ""    — KEY EXISTS BUT IS EMPTY (EDGE CASE FROM EXTERNAL WRITES OR MANUAL DEVTOOLS EDIT).
      //* BOTH ARE TREATED AS AN EMPTY COLLECTION.
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      //* JSON.parse CAN RETURN ANY SHAPE: OBJECT, NUMBER, NULL, STRING.
      //* CASTING A NON-ARRAY DIRECTLY TO T[] WOULD PRODUCE SILENT RUNTIME ERRORS IN CONSUMERS.
      //* Array.isArray IS THE ONLY SAFE SHAPE GUARD BEFORE THE CAST.
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      //* JSON.parse THROWS IF THE STORED STRING IS MALFORMED (TRUNCATED WRITE, MANUAL DEVTOOLS EDIT,
      //* STORAGE MIGRATION THAT LEFT BEHIND AN INCOMPATIBLE VALUE).
      //* RETURNING [] RECOVERS GRACEFULLY INSTEAD OF CRASHING THE COMPONENT TREE.
      return [];
    }
  }

  write(items: T[]): void {
    //* SAME SSR GUARD AS read() — WRITE CALLED DURING SSR (E.G. FROM A SERVER ACTION) MUST NOT CRASH.
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(this.key, JSON.stringify(items));
      //* EVENT IS DISPATCHED INSIDE THE try BLOCK, AFTER setItem SUCCEEDS.
      //* IF setItem THROWS (QUOTA EXCEEDED), THIS LINE IS NEVER REACHED — LISTENERS ARE NOT
      //* NOTIFIED OF A STATE THAT WAS NEVER ACTUALLY PERSISTED. SEE THE catch BLOCK BELOW.
      window.dispatchEvent(new CustomEvent(this.changeEvent));
    } catch (error) {
      //* QUOTA EXCEEDED — STORAGE IS FULL. EVENT IS NOT DISPATCHED SO LISTENERS
      //* DO NOT RECEIVE A STALE STATE UPDATE AS IF THE WRITE SUCCEEDED.
      if (
        error instanceof DOMException &&
        //* BROWSERS USE DIFFERENT NAMES FOR THE SAME QUOTA ERROR:
        //* "QuotaExceededError"       — CHROME, SAFARI, MODERN EDGE.
        //* "NS_ERROR_DOM_QUOTA_REACHED" — FIREFOX (LEGACY NAME, STILL PRESENT IN SOME VERSIONS).
        //* BOTH MUST BE CHECKED TO HANDLE THE ERROR CONSISTENTLY ACROSS ALL BROWSERS.
        (error.name === "QuotaExceededError" ||
          error.name === "NS_ERROR_DOM_QUOTA_REACHED")
      ) {
        console.warn(
          `[LocalStorageAdapter] Storage quota exceeded for key "${this.key}". Write skipped.`,
        );
        return;
      }
      //* ANY NON-QUOTA DOMException OR UNEXPECTED ERROR IS RE-THROWN.
      //* QUOTA EXHAUSTION IS AN EXPECTED OPERATIONAL CONDITION; ALL OTHER ERRORS ARE NOT.
      throw error;
    }
  }

  //* EXPOSES changeEvent AS A READ-ONLY PROPERTY TO SATISFY IStorageAdapter<T>
  //* WITHOUT LEAKING THE PRIVATE FIELD DIRECTLY.
  //* THE BASE HOOK USES THIS TO SUBSCRIBE AND UNSUBSCRIBE FROM THE CORRECT EVENT.
  get eventName(): string {
    return this.changeEvent;
  }
}

//* ─────────────────────────────────────────────────────────────────────────────
//* FILE GOAL
//*   CONCRETE IMPLEMENTATION OF IStorageAdapter<T> BACKED BY window.localStorage.
//*   HANDLES SSR SAFETY, JSON PARSE FAILURES, QUOTA ERRORS, AND CHANGE EVENTS
//*   SO THAT DOMAIN HOOKS (useCart, useWishlist) CONTAIN ZERO STORAGE LOGIC.
//*
//* WORKFLOW
//*   1. INSTANTIATE ONCE AT MODULE SCOPE IN THE DOMAIN HOOK (NOT INSIDE THE FUNCTION).
//*      const adapter = new LocalStorageAdapter<ICartItem>("thp:cart", "thp:cart:change");
//*
//*   2. PASS THE INSTANCE TO useStorageCollection(adapter).
//*      THE BASE HOOK CALLS read() ON MOUNT AND SUBSCRIBES TO eventName FOR SYNC.
//*
//*   3. CALL adapter.write(newItems) INSIDE DOMAIN HOOK OPERATIONS (addToCart, etc.).
//*      write() PERSISTS TO localStorage AND DISPATCHES changeEvent ON SUCCESS.
//*      IF setItem THROWS (QUOTA EXCEEDED), THE EVENT IS NOT DISPATCHED — LISTENERS
//*      ARE NEVER NOTIFIED OF A STATE THAT WAS NEVER ACTUALLY SAVED.
//*
//* USE CASES
//*   — ANY DOMAIN THAT NEEDS PERSISTENT, REACTIVE, CROSS-TAB-SYNCED BROWSER STORAGE.
//*   — CURRENT CONSUMERS: useCart ("thp:cart"), useWishlist ("thp:wishlist").
//*   — ADDING A NEW COLLECTION NEEDS ONLY A NEW INSTANCE — NO CHANGES TO THIS FILE.
//*
//* HOW TO USE IN THE CODEBASE
//*   // IN A DOMAIN HOOK FILE (e.g. src/modules/recently-viewed/hooks/useRecentlyViewed.ts)
//*   import { LocalStorageAdapter } from "@/lib/storage";
//*   import { useStorageCollection } from "@/hooks/storage/useStorageCollection";
//*
//*   const adapter = new LocalStorageAdapter<IRecentlyViewedItem>(
//*     "thp:recently-viewed",       // localStorage KEY — MUST USE "thp:" PREFIX
//*     "thp:recently-viewed:change" // CustomEvent NAME DISPATCHED AFTER EVERY WRITE
//*   );
//*
//*   export const useRecentlyViewed = () => {
//*     const { items, isHydrated, count } = useStorageCollection(adapter);
//*     ...
//*   };
//* ─────────────────────────────────────────────────────────────────────────────
