export type { IStorageAdapter } from "./storage.interface";
export { LocalStorageAdapter } from "./localStorage.adapter";
export { SessionStorageAdapter } from "./sessionStorage.adapter";
export { CookieAdapter }        from "./cookie.adapter";

//* ─────────────────────────────────────────────────────────────────────────────
//* FILE GOAL
//*   SINGLE PUBLIC ENTRY POINT FOR THE ENTIRE STORAGE MODULE.
//*   ALL CONSUMERS IMPORT FROM "@/lib/storage" — NEVER FROM INTERNAL FILE PATHS.
//*
//* WORKFLOW
//*   INTERNAL FILES (storage.interface.ts, localStorage.adapter.ts) ARE PRIVATE.
//*   THIS BARREL RE-EXPORTS ONLY WHAT EXTERNAL CODE IS ALLOWED TO USE.
//*   WHEN AN INTERNAL FILE IS RENAMED, SPLIT, OR MOVED, ONLY THIS FILE CHANGES —
//*   EVERY CONSUMER IMPORT STAYS VALID WITHOUT A SINGLE EDIT ELSEWHERE.
//*
//* USE CASES
//*   CORRECT   → import { LocalStorageAdapter }        from "@/lib/storage"
//*   CORRECT   → import type { IStorageAdapter }       from "@/lib/storage"
//*   INCORRECT → import { LocalStorageAdapter }        from "@/lib/storage/localStorage.adapter"
//*   INCORRECT → import type { IStorageAdapter }       from "@/lib/storage/storage.interface"
//*   DIRECT INTERNAL IMPORTS COUPLE CONSUMERS TO FILE STRUCTURE AND BREAK ON REFACTORS.
//*
//* HOW TO USE IN THE CODEBASE
//*   import { LocalStorageAdapter }   from "@/lib/storage";  // CONCRETE ADAPTER
//*   import type { IStorageAdapter }  from "@/lib/storage";  // INTERFACE (TYPE-ONLY IMPORT)
//* ─────────────────────────────────────────────────────────────────────────────
