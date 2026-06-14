//* ERROR TYPE HIERARCHY — DEFINES ALL TYPED ERRORS USED ACROSS THE APPLICATION
//* GOAL: REPLACE GENERIC throw new Error("string") WITH STRUCTURED, TYPE-SAFE ERROR OBJECTS
//* BENEFIT: EVERY CATCH BLOCK AND ERROR HANDLER CAN USE instanceof TO ROUTE ERRORS CORRECTLY
//* PATTERN: AppError (BASE) → DOMAIN-SPECIFIC CHILD CLASSES (UNAUTHORIZED, FORBIDDEN, ETC.)

//* ALL POSSIBLE ERROR CATEGORIES
//* THIS ALLOWS UI LOGIC TO BRANCH ON CODE INSTEAD OF PARSING HUMAN-READABLE MESSAGE STRINGS
export type ErrorCode =
  | "NOT_FOUND"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NETWORK_ERROR"
  | "SERVER_ERROR"
  | "RATE_LIMIT"
  | "MAINTENANCE"
  | "VALIDATION_ERROR";

//* BASE CLASS — ALL APPLICATION ERRORS EXTEND THIS SINGLE CLASS
//* EXTENDING THE NATIVE JS Error GIVES US: STACK TRACES, instanceof CHECKS, AND catch(e) COMPATIBILITY
//* WHY CLASS AND NOT PLAIN OBJECT: instanceof IS THE ONLY RELIABLE WAY TO TYPE-CHECK ERRORS AT RUNTIME
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: ErrorCode,    //* MACHINE-READABLE CATEGORY — USE FOR ROUTING LOGIC
    public readonly statusCode: number, //* HTTP STATUS CODE — MAPS DIRECTLY TO API/RESPONSE STATUS
  ) {
    super(message);
    this.name = "AppError";
    //* REQUIRED FIX: TYPESCRIPT BREAKS THE PROTOTYPE CHAIN WHEN EXTENDING BUILT-IN CLASSES
    //* WITHOUT THIS LINE, instanceof CHECKS WOULD SILENTLY FAIL IN COMPILED JS
    Object.setPrototypeOf(this, new.target.prototype);
  }

  //* SAFE SERIALIZATION — STRIPS THE STACK TRACE BEFORE SENDING ERROR DATA TO THE CLIENT
  //* NEVER EXPOSE STACK TRACES TO THE BROWSER: THEY REVEAL INTERNAL FILE PATHS AND LOGIC
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      statusCode: this.statusCode,
      message: this.message,
    };
  }
}

//* 404 — RESOURCE DOES NOT EXIST
//* TRIGGERED BY: notFound() IN SERVER COMPONENTS, OR WHEN A DB QUERY RETURNS NULL
export class NotFoundError extends AppError {
  constructor(resource = "Page") {
    super(`${resource} not found`, "NOT_FOUND", 404);
    this.name = "NotFoundError";
  }
}

//* 401 — USER IS NOT AUTHENTICATED (NOT LOGGED IN)
//* ACTION: REDIRECT TO /unauthorized → USER MUST SIGN IN FIRST
//* IMPORTANT: DO NOT CONFUSE WITH 403 — 401 MEANS "WHO ARE YOU?", NOT "YOU CAN'T DO THIS"
export class UnauthorizedError extends AppError {
  constructor(message = "Authentication required to access this resource") {
    super(message, "UNAUTHORIZED", 401);
    this.name = "UnauthorizedError";
  }
}

//* 403 — USER IS AUTHENTICATED BUT LACKS PERMISSION FOR THIS RESOURCE
//* ACTION: REDIRECT TO /forbidden — DO NOT REDIRECT TO LOGIN (USER IS ALREADY SIGNED IN)
//* IMPORTANT: DO NOT CONFUSE WITH 401 — 403 MEANS "I KNOW WHO YOU ARE, BUT YOU CANNOT DO THIS"
export class ForbiddenError extends AppError {
  constructor(message = "You do not have permission to access this resource") {
    super(message, "FORBIDDEN", 403);
    this.name = "ForbiddenError";
  }
}

//* 0 (NO HTTP STATUS) — REQUEST NEVER REACHED THE SERVER
//* CAUSES: NO INTERNET, DNS FAILURE, SERVER UNREACHABLE, REQUEST TIMEOUT
//* ACTION: SHOW /network-error PAGE WITH A RETRY BUTTON
export class NetworkError extends AppError {
  constructor(message = "Unable to connect. Please check your connection.") {
    super(message, "NETWORK_ERROR", 0);
    this.name = "NetworkError";
  }
}

//* 500 — UNHANDLED EXCEPTION ON THE SERVER SIDE
//* ACTION: SURFACED TO THE NEAREST Next.js error.tsx BOUNDARY VIA throwOnError
//* THE reset() FUNCTION FROM error.tsx RETRIES THE FAILED RENDER WITHOUT A FULL PAGE RELOAD
export class ServerError extends AppError {
  constructor(message = "An unexpected server error occurred") {
    super(message, "SERVER_ERROR", 500);
    this.name = "ServerError";
  }
}

//* 429 — CLIENT HAS SENT TOO MANY REQUESTS IN A SHORT WINDOW (RATE LIMITED BY THE API)
//* ACTION: REDIRECT TO /rate-limit — UI SHOWS A COUNTDOWN BEFORE ALLOWING RETRY
export class RateLimitError extends AppError {
  constructor(message = "Too many requests. Please wait and try again.") {
    super(message, "RATE_LIMIT", 429);
    this.name = "RateLimitError";
  }
}

//* 503 — SERVER IS UP BUT INTENTIONALLY REFUSING TRAFFIC (PLANNED MAINTENANCE OR OVERLOAD)
//* ACTION: REDIRECT TO /maintenance — DO NOT SHOW "GO HOME" SINCE THE WHOLE SITE MAY BE DOWN
export class MaintenanceError extends AppError {
  constructor(message = "Service is temporarily unavailable for maintenance") {
    super(message, "MAINTENANCE", 503);
    this.name = "MaintenanceError";
  }
}
