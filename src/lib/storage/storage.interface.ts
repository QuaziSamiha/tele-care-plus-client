//* ─────────────────────────────────────────────────────────────────────────────
//* FILE GOAL
//*   DEFINE THE CONTRACT EVERY STORAGE BACKEND MUST SATISFY.
//*   CONSUMERS (useStorageCollection) DEPEND ON THIS INTERFACE, NOT ON ANY
//*   CONCRETE CLASS — SO THE BACKEND CAN BE SWAPPED WITHOUT TOUCHING CONSUMERS.
//*
//* WORKFLOW
//*   1. A CONCRETE CLASS (e.g. LocalStorageAdapter<T>) IMPLEMENTS THIS INTERFACE.
//*   2. AN INSTANCE OF THAT CLASS IS PASSED TO useStorageCollection<T>.
//*   3. THE BASE HOOK CALLS read() ON MOUNT, write() ON EVERY MUTATION, AND
//*      SUBSCRIBES TO eventName TO RE-SYNC REACT STATE AFTER EACH WRITE.
//*
//* USE CASES
//*   LocalStorageAdapter<T>   — window.localStorage  (CURRENT IMPLEMENTATION)
//*   SessionStorageAdapter<T> — window.sessionStorage (TAB-SCOPED, NO CROSS-TAB SYNC)
//*   IndexedDBAdapter<T>      — LARGE PAYLOADS OR SAFARI ITP RESILIENCE
//*   InMemoryAdapter<T>       — JEST TESTS WITH NO BROWSER DEPENDENCY
//*
//* HOW TO ADD A NEW BACKEND
//*   class SessionStorageAdapter<T> implements IStorageAdapter<T> {
//*     read(): T[]             { ... }
//*     write(items: T[]): void { ... }
//*     get eventName(): string { ... }
//*   }
//*   NO CHANGES NEEDED IN useStorageCollection OR ANY DOMAIN HOOK.
//* ─────────────────────────────────────────────────────────────────────────────

export interface IStorageAdapter<T> {
  read(): T[];
  write(items: T[]): void;
  readonly eventName: string;
}
