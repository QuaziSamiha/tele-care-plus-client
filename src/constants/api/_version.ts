//* SINGLE POINT TO ENABLE API VERSIONING ACROSS EVERY ROUTE.
//* CURRENT STATE — NO PREFIX:  v("/auth/login")  →  "/auth/login"
//* TO ADD V1 — CHANGE RETURN TO:  `/v1${path}` as `/v1${T}`
//* THAT ONE-LINE CHANGE PROPAGATES TO EVERY PATH IN THE CODEBASE AUTOMATICALLY.
export const v = <T extends string>(path: T): T => path;
