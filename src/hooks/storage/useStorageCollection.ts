"use client";

//* ─────────────────────────────────────────────────────────────────────────────
//* FILE GOAL
//*   GENERIC HYDRATION AND SYNC ENGINE FOR ANY IStorageAdapter<T> BACKEND.
//*   OWNS THE ENTIRE LIFECYCLE OF CLIENT-SIDE COLLECTION STATE:
//*   INITIAL HYDRATION · SAME-TAB SYNC · CROSS-TAB SYNC · CLEANUP.
//*   DOMAIN HOOKS (useCart, useWishlist) DELEGATE ALL OF THIS HERE AND CONTAIN
//*   ONLY THEIR OWN DOMAIN OPERATIONS — NOTHING STORAGE-RELATED.
//*
//* WORKFLOW
//*   1. ON MOUNT:   adapter.read() HYDRATES REACT STATE FROM STORAGE.
//*                  isHydrated FLIPS TO true — CONSUMERS CAN NOW RENDER REAL DATA.
//*   2. SAME-TAB:   adapter.write() DISPATCHES adapter.eventName AFTER EVERY WRITE.
//*                  THE sync CALLBACK READS FRESH STATE AND UPDATES THE HOOK.
//*   3. CROSS-TAB:  THE BROWSER FIRES THE NATIVE "storage" EVENT IN ALL OTHER TABS.
//*                  THE SAME sync CALLBACK HANDLES IT — STATE STAYS IN SYNC ACROSS TABS.
//*                  NOTE: ONLY localStorage TRIGGERS "storage" ACROSS TABS.
//*                        SessionStorageAdapter AND CookieAdapter DO NOT.
//*   4. ON UNMOUNT: BOTH LISTENERS ARE REMOVED — NO STALE SUBSCRIPTIONS.
//*
//* USE CASES
//*   — PASS A LocalStorageAdapter   FOR PERSISTENT, CROSS-TAB REACTIVE COLLECTIONS.
//*   — PASS A SessionStorageAdapter FOR TAB-SCOPED TEMPORARY STATE.
//*   — PASS A CookieAdapter         FOR SMALL SERVER-READABLE PREFERENCE DATA.
//*   — PASS ANY CUSTOM ADAPTER THAT SATISFIES IStorageAdapter<T> — ZERO CHANGES HERE.
//*
//* HOW TO USE IN THE CODEBASE
//*   import { LocalStorageAdapter } from "@/lib/storage";
//*   import { useStorageCollection } from "@/hooks/storage/useStorageCollection";
//*
//*   const adapter = new LocalStorageAdapter<ICartItem>("thp:cart", "thp:cart:change");
//*
//*   export const useCart = () => {
//*     const { items, isHydrated, count } = useStorageCollection(adapter);
//*     //* ADD ONLY DOMAIN OPERATIONS HERE — addToCart, removeFromCart, clearCart, etc.
//*   };
//* ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import type { IStorageAdapter } from "@/lib/storage";

export const useStorageCollection = <T>(
  adapter: IStorageAdapter<T>,
): { items: T[]; isHydrated: boolean; count: number } => {
  //* COMBINED STATE OBJECT MAKES HYDRATION A SINGLE ATOMIC setState CALL.
  //* TWO SEPARATE useState CALLS WOULD ALLOW A RENDER WHERE items IS POPULATED
  //* BUT isHydrated IS STILL false (OR THE INVERSE) — AN INCONSISTENT STATE
  //* CONSUMERS CANNOT SAFELY HANDLE. ONE OBJECT ELIMINATES THAT WINDOW.
  const [{ items, isHydrated }, setStorageState] = useState<{
    items: T[];
    isHydrated: boolean;
  }>({ items: [], isHydrated: false });

  useEffect(() => {
    //* STORAGE IS OUTSIDE REACT'S STATE MODEL — useEffect IS THE ONLY SAFE PLACE
    //* TO READ IT AND HYDRATE REACT STATE. THE RULE SUPPRESSION IS INTENTIONAL:
    //* THIS IS NOT A BUG PATTERN, IT IS THE CORRECT WAY TO SYNC AN EXTERNAL SOURCE.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStorageState({ items: adapter.read(), isHydrated: true });

    //* PULL MODEL — sync CALLS adapter.read() ON EVERY EVENT RATHER THAN USING A PAYLOAD.
    //* CUSTOM EVENTS CARRY NO PAYLOAD. read() IS THE ONLY SOURCE OF COMMITTED STORAGE STATE.
    const sync = (): void =>
      setStorageState({ items: adapter.read(), isHydrated: true });

    window.addEventListener(adapter.eventName, sync); //* SAME-TAB WRITES
    window.addEventListener("storage", sync); //* CROSS-TAB WRITES (localStorage ONLY)

    //* CLEANUP PREVENTS STALE LISTENERS FROM CALLING setStorageState ON AN UNMOUNTED COMPONENT.
    return () => {
      window.removeEventListener(adapter.eventName, sync);
      window.removeEventListener("storage", sync);
    };
  }, [adapter]);

  //* count SAVES EVERY CONSUMER FROM COMPUTING items.length INDEPENDENTLY.
  //* GATE RENDERING ON isHydrated TO PREVENT AN EMPTY-LIST FLASH ON FIRST RENDER:
  //*   if (!isHydrated) return <Skeleton />;
  //*   return <List items={items} />;
  return { items, isHydrated, count: items.length };
};
