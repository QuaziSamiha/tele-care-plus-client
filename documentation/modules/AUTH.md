<details>
<summary>Folder Structure</summary>

<details>
<summary>auth.actions.ts ( prev file cookiesAction.ts)</summary>

- **Eliminated Hardcoded Strings:** Replaced raw text strings (like `"accessToken"`) with centralized constants (`ACCESS_TOKEN_KEY`), eliminating the risk of typos and breaking changes across the codebase.
- **Mitigated XSS Security Risks:** Enforced `httpOnly: true` specifically on the refresh token. This blocks browser JavaScript from reading the token, meaning malicious scripts cannot steal session credentials during a **Cross-Site Scripting (XSS)** attack.
- **Secured Production Data:** Added the `secure: IS_PRODUCTION` flag to guarantee that tokens are only sent over encrypted HTTPS connections in production environments, preventing network interception.
- **Controlled Cookie Sharing:** Applied `sameSite: "lax"` to prevent the browser from sending authentication cookies during untrusted, third-party cross-site requests, minimizing exposure to forgery attacks.
- **Balanced Client Accessibility:** Kept `httpOnly: false` strictly for the access token, allowing client-side HTTP clients (like Axios interceptors) to read it legitimately while keeping the more sensitive refresh token locked down on the server.

- This file can be kept 'src/actions/auth.actions.ts'
- [Previous Code](https://github.com/QuaziSamiha/natura-care-client/blob/main/src/actions/cookiesAction.ts)
</details>

<details>
<summary>auth.config.ts (prev file authOptions)</summary>

| Feature / Metric          | Before (Legacy)                                                                            | After (Refactored)                                                                         | Key Benefit                                                                                  |
| :------------------------ | :----------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------- |
| **Type Safety**           | No `declare module` augmentation. Custom session fields were silently typed as `any`.      | Proper **Session and JWT module augmentation** implemented. Custom fields are fully typed. | Prevents silent bugs and brings back code editor autocomplete for custom user data.          |
| **Null Safety**           | `session.provider = token.provider as string` <br> Unsafely forced a type override.        | `session.provider = token.provider ?? ""` <br> Safe **nullish coalescing**.                | Prevents runtime crashes if the provider is unexpectedly missing or null.                    |
| **Data Leak Prevention**  | `session.token = token` <br> Exposed the **entire** JWT structure to the frontend browser. | **Removed.** Only specific, safe properties (like `provider` and `sub`) are forwarded.     | Heavy security upgrade. Sensitive backend token data is no longer leaked to the client side. |
| **Bundle Optimization**   | `import { NextAuthOptions }` <br> Standard runtime import of a type.                       | `import type { NextAuthOptions }` <br> **Compile-time only** import.                       | The import is completely stripped from the final JavaScript bundle, shrinking its size.      |
| **File Naming & Exports** | Exported as `authOptions` inside a file named `auth.config.ts` (mismatched naming).        | Exported as `authConfig`. Matches the `auth.config.ts` filename perfectly.                 | Improves code maintainability and follows clean architectural naming standards.              |

- [Prev Code](https://github.com/QuaziSamiha/natura-care-client/blob/main/src/helpers/authOptions.ts)
</details>

<details>
<summary>next-auth.d.ts and auth.types.ts</summary>

| File                      | Correct Extension | Reason                                                      |
| :------------------------ | :---------------: | :---------------------------------------------------------- |
| `auth.types.ts`           |    `.types.ts`    | You own these types, they are exported and imported         |
| `next-auth.d.ts`          |      `.d.ts`      | Augments a third-party library's types, must be ambient     |
| Your own types as `.d.ts` |     ❌ Wrong      | Your types would become non-importable ambient declarations |

- [prev code](https://github.com/QuaziSamiha/natura-care-client/blob/main/src/types/next-auth.d.ts)
</details>

<details>
<summary>auth.service.ts</summary>

- [Prev Code](https://github.com/QuaziSamiha/natura-care-client/blob/main/src/services/auth.service.ts)

---

### Issue 1 — CRITICAL: `logout()` Could Not Delete the `httpOnly` Refresh Token

`cookieHelper.remove()` is browser JavaScript (`js-cookie`). Cookies set with `httpOnly: true` are invisible to browser JS — the browser silently ignores any attempt to delete them. The refresh token was therefore never actually cleared on logout, leaving a valid credential in the browser after the user signed out.

|                            | Before                                                                           | After                                                                        |
| :------------------------- | :------------------------------------------------------------------------------- | :--------------------------------------------------------------------------- |
| **How tokens are deleted** | `cookieHelper.remove(ACCESS_TOKEN_KEY)` `cookieHelper.remove(REFRESH_TOKEN_KEY)` | `await accessTokenDelete()` `await refreshDelete()` (Next.js server actions) |
| **Refresh token cleared?** | ❌ No — `httpOnly` blocks browser JS                                             | ✅ Yes — server action runs on the server where `httpOnly` is not a barrier  |
| **`logout` signature**     | `logout: () => void`                                                             | `logout: async (onLogout?: () => void): Promise<void>`                       |

`axiosInstance.ts` was also updated from `authService.logout()` to `await authService.logout()` to match the now-async signature.

---

### Issue 2 — MAJOR: Inline Parameter Types Scattered Across the Service

`login` and `socialLogin` had their parameter shapes written inline as anonymous object literals. These shapes are part of the auth domain contract and must be named, exported, and reusable.

Three interfaces were added to `auth.types.ts`:

| Interface               | Used By                                      |
| :---------------------- | :------------------------------------------- |
| `ILoginCredentials`     | `authService.login` parameter                |
| `ISocialLoginPayload`   | `authService.socialLogin` parameter          |
| `IAuthTokens`           | Return `data` field of both login endpoints  |
| `IRefreshTokenResponse` | Return shape of the `/auth/refresh` endpoint |

---

### Issue 3 — MAJOR: Missing Return Type Annotations on API Methods

Without explicit return types, TypeScript infers `Promise<any>` from the Axios response. Any consumer of these methods loses type safety and IDE autocomplete on the response.

| Method              | Before                                        | After                                                                            |
| :------------------ | :-------------------------------------------- | :------------------------------------------------------------------------------- |
| `login`             | `async (credentials: {...})` — no return type | `async (credentials: ILoginCredentials): Promise<IGenericResponse<IAuthTokens>>` |
| `socialLogin`       | `async (data: {...})` — no return type        | `async (data: ISocialLoginPayload): Promise<IGenericResponse<IAuthTokens>>`      |
| `getNewAccessToken` | No generic on `axios.post`                    | `axios.post<IRefreshTokenResponse>(...)` — `response.data` is now typed          |

---

### Issue 4 — MAJOR: `getUserInfo` Was Misclassified Under API Methods

`getUserInfo` makes no HTTP call. It reads and decodes the access token from cookies synchronously. Placing it under the `API METHODS` comment block incorrectly implied a network call.

**Fix:** Moved `getUserInfo` to the `HELPER METHODS` section alongside `isLoggedIn` and `logout`, which are all pure client-side utilities.

---

### Issue 5 — MINOR: Hard `window.location.href` Navigation Bypassed Next.js Router

`window.location.href = "/"` triggers a full browser page reload. It discards the React tree, resets in-memory state, and prevents smooth SPA transitions. Callers (React components) that already hold a router reference had no way to opt into a softer navigation.

|                       | Before                                             | After                                                                                                     |
| :-------------------- | :------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| **Navigation**        | `window.location.href = "/"` (hard reload, always) | `onLogout?.()` if provided, otherwise falls back to `window.location.href = "/"`                          |
| **Component usage**   | `authService.logout()`                             | `authService.logout(router.push.bind(router, "/"))`                                                       |
| **Interceptor usage** | `authService.logout()`                             | `await authService.logout()` — no callback, falls back to hard reload (acceptable in a non-React context) |

---

### Issue 6 — MINOR: Decorative `---` Comment Separators Were Not Conventional

The section dividers used the format `//* --- API METHODS (USING AXIOS) ---`. The `---` decoration adds visual noise without communicating anything extra. Plain `//* API METHODS` is shorter and consistent with the codebase comment convention.

**Fix:** Removed all `---` decorations from both section dividers.

</details>

<details>
<summary>auth.utils.ts (prev file auth.service.ts)</summary>

- [prev code](https://github.com/QuaziSamiha/natura-care-client/blob/main/src/services/auth.service.ts)
</details>

<details>
<summary>auth.constants.ts (prev file storageKey)</summary>

- [prev code](https://github.com/QuaziSamiha/natura-care-client/blob/main/src/constants/auth/storageKey.ts)
</details>

<details>
<summary>Modification Guide</summary>
Now I have everything. Let me write the full review.

Auth Module — Senior Engineer Code Review
Organized by severity. I'll go file-by-file after the critical cross-cutting issues.

Critical Bugs

1. Backtick literal in className (4 files)

In layout.tsx:68, ForgotPassword.tsx:14, SignIn.tsx:32, SignUp.tsx:55:

// BUG — backticks are literal characters, not template literals in JSX strings
className="w-full `max-w-[480px]` mx-auto ..."
// FIX
className="w-full max-w-[480px] mx-auto ..."
Tailwind never applies max-w-[480px] because the class name is literally `max-w-[480px]` with backtick characters.

2. ForgotPassword submit bypasses validation (ForgotPassword.tsx:41-44)

// BUG — Link navigates immediately, form handleSubmit never fires

<Link href="otp-verification">
  <SubmitButton submitTitle="Next" />
</Link>
Navigation must happen inside onSubmit after a successful API response, not via a wrapper <Link>. Also the href is relative (otp-verification), which should be /otp-verification.

3. Token access type bug in useSocialAuth (useSocialAuth.ts:16-20)

authService.socialLogin returns Promise<IGenericResponse<IAuthTokens>>. The IGenericResponse wrapper has a .data field of type IAuthTokens. But the onSuccess handler accesses data.refresh_token directly — this is undefined at runtime. It must be data.data.refresh_token to match useLogin.ts, which correctly accesses response?.data.

4. Cookie tokens have no expiry (auth.actions.ts:13-21)

Neither refreshCreate nor accessTokenCreate sets maxAge or expires. Both become session cookies — they vanish on browser close. The refresh token especially should persist (e.g., 7 days). Also missing explicit path: "/", which can cause inconsistent cookie availability depending on the Server Action call path.

5. useSocialAuth runs unconditionally in SignUp (SignUp.tsx:38-40)

const { isPending: isSocialSyncing } = useSocialAuth(() => {
router.push("/dashboard");
});
The Google button is fully commented out, but this hook is still mounted. Its useEffect watches for status === "authenticated" from NextAuth. If a user has a leftover NextAuth session (e.g., from a previous OAuth attempt that failed mid-way), this hook silently fires authService.socialLogin on the signup page without user interaction. Remove the hook call until the button is re-enabled, or guard it behind a flag.

Major Issues 6. PR documentation inside source code (useLogin.ts:43-82)

The entire multi-paragraph JSDoc block at the bottom is a commit message / PR description. It explains what was changed and why in past tense. Source files are not changelogs — delete it entirely. The code speaks for itself, and git history carries the rest.

7. Debug hook shipped in production file (useSocialAuth.ts:59-108)

useSocialSync is explicitly labeled "DEBUG HOOK" with emoji console output and is exported from the same file. This must not ship. Either delete it, or move it to a **dev**/ directory that is excluded from production builds.

8. Massive commented-out code blocks

SignUp.tsx — commented handleGoogleSignup, commented Google button, commented useState, commented import
useSocialAuth.ts — entire 60-line alternate implementation commented at the bottom
SignIn.tsx — multiple commented handler props, duplicate t() alternatives
Dead code is noise. If you want to preserve an alternate implementation, use git branches, not comments.

9. console.log in production hooks and handlers

File Line Statement
useSocialAuth.ts 10 console.log("session : ", session) — runs on every render
useSocialAuth.ts 24 console.log("provider : ", provider)
SignIn.tsx onSubmit console.log(data)
OtpVerification.tsx handleSubmit console.log("Submitted OTP:", otp)
ForgotPassword.tsx onSubmit console.log(data) 10. Duplicate modal instance in OtpVerification (OtpVerification.tsx:46-65)

<UnderDevelopmentModal> is rendered twice — once under the Verify button, once under the Resend link — both bound to the same isModalOpen state. One instance is sufficient; render it once at the component root.

11. Service layer handles navigation (auth.service.ts:38-43)

logout: async (onLogout?: () => void): Promise<void> => {
...
} else {
window.location.href = "/"; // ← service doing navigation
}
}
Services must not touch the DOM or router. Make onLogout required, or remove the fallback entirely and let callers decide what to do after logout. window.location.href also bypasses the i18n router and the Next.js navigation stack.

12. globals.css imported in auth layout (layout.tsx:5)

import "../../../styles/globals.css";
Global CSS belongs in the root layout (or app/layout.tsx). Importing it in a nested layout risks double-injection in some build configurations. Remove this import.

Minor Issues 13. OTP allows alphanumeric instead of digits-only (OtpVerification.tsx:23)

pattern={REGEXP_ONLY_DIGITS_AND_CHARS}
// should be REGEXP_ONLY_DIGITS for a numeric OTP 14. <Link> vs button for Resend (OtpVerification.tsx:56-60)

<Link href="" onClick={() => setIsModalOpen(true)} ...>Resend</Link>
An empty href="" is invalid and will cause a page reload fallback. Use a <button type="button"> instead.

15. Missing i18n Link in OtpVerification (OtpVerification.tsx:3)

All other auth components import Link from @/i18n/navigation. OtpVerification imports from next/link. Inconsistent — use the i18n-aware Link everywhere in this module.

16. OTP submit doesn't guard on length (OtpVerification.tsx:25-28)

There is no check that otp.length === 6 before submission. The Verify button should be disabled={otp.length < 6}.

17. Untranslated strings in ForgotPassword and OtpVerification

Both components have hardcoded English text ("Forgot Password", "Enter Your email...", "OTP Verification", "Haven't received a code?") while the rest of the module uses useTranslations. Also a typo: "Enter Your email to to change" — double "to".

18. isSocialSyncing declared but never used (SignUp.tsx:38)

const { isPending: isSocialSyncing } = useSocialAuth(...);
// isSocialSyncing is never referenced — the button using it is commented out 19. Layout comment syntax noise (layout.tsx)

{/_ //_ ============== LEFT SIDE ============== _/}
The // inside JSX comments is JavaScript single-line comment syntax. Inside {/_ _/}, it has no meaning — it's just literal text. Use {/_ === LEFT SIDE === \*/} or remove the comments.

20. Page file noise

signin/page.tsx:13-19 — multi-line performance note belongs in a wiki/ADR, not source
otp-verification/page.tsx:1 and signup/page.tsx:1 — leading blank lines 21. Password validation on sign-in schema (signin.schema.ts:6)

password: z.string().min(6, "Password must be at least 6 characters long")
Login should not enforce password complexity — just z.string().min(1, "Password is required"). Complexity rules on login can reject valid users if the policy ever changes, and they leak implementation details.

22. poppins.variable declared but unused (layout.tsx:9-13)

The variable: "--font-poppins" option is set, but className uses poppins.className (direct class injection) not poppins.variable (CSS variable for Tailwind). Either use the variable approach consistently or remove the variable option.

Architecture / Portability Notes
The module is well-structured for portability (actions, components, hooks, services, schemas, types, utils, constants, config). A consumer can drop it into another project by swapping out @/i18n/navigation, @/lib/axios/axiosInstance, @/config/env.config, and the shared form components.

One coupling concern: signup.schema.ts imports thaiPhoneSchema from @/lib/schemas/phone.schema. This is geography-specific validation embedded in the auth module. If portability is a goal, make the phone schema injectable or move phone validation out of the core signup schema (e.g., an optional phoneSchema param).

The dual-token strategy (httpOnly refresh + readable access) is sound. The getNewAccessToken raw axios call to bypass interceptors is the correct pattern for refresh logic.

Quick Fix Priority Order
Backtick className bug (visual regression in production now)
Cookie maxAge missing (auth breaks on browser close)
useSocialAuth type bug (data.data.refresh_token)
ForgotPassword <Link> wrapping submit button
Remove useSocialSync debug hook + all commented code blocks
Remove PR doc from useLogin.ts
window.location.href out of authService.logout
Remove useSocialAuth call from SignUp while button is disabled
All remaining console.log calls

</details>

<details>
<summary>Prompt</summary>
@src/app/[locale]/(auth)/forgot-password/page.tsx @src/app/[locale]/(auth)/otp-verification/page.tsx @src/app/[locale]/(auth)/signin/page.tsx @src/app/[locale]/(auth)/signup/page.tsx @src/app/[locale]/(auth)/layout.tsx @src/modules/auth/  all files check the overall everything, maintain senior enineer code review, industry standard, module based (which module can be used totally separately in a different project)  
</details>


<details>
<summary>QA Prompt</summary>
Here's the prompt:

---

I am in the **testing and quality assurance phase** of my Next.js project. I want to start by thoroughly validating the **sign-up flow end-to-end** — not just whether it works, but whether every related file meets **senior-engineer standards**: industry-grade architecture, full optimization, scalability, and maintainability.

Before doing anything, **read and trace the entire sign-up flow** from entry point to completion — every component, hook, API call, validation schema, state update, error handling path, route transition, and server action or API route involved. Do not assume anything; derive every finding strictly from the actual code.

---

**⚠️ GLOBAL ENFORCEMENTS**

- Every comment must follow the format `//* COMMENT` with every letter **fully UPPERCASED**
- Always use `yarn add <package>` or `yarn add -D <package>` — never `npm`
- Never break existing functionality — all changes must be backward compatible
- Never add abstractions or libraries not justified by actual project complexity

---

**Phase 1 — Full Sign-Up Flow Trace & Audit**

Trace and map the complete sign-up flow by reading every file involved. Produce a **flow map** covering:

- Entry point — which page, route, or component initiates sign-up
- Form layer — component structure, controlled vs uncontrolled inputs, form library used
- Validation layer — where and how input validation occurs (client-side, server-side, or both)
- Submission layer — how the form data is submitted (Server Action, API route, external API call)
- API/service layer — how the request is constructed, typed, and sent
- Error handling layer — how API errors, network errors, and validation errors are caught and surfaced to the user
- Success handling layer — redirect logic, token storage, session initialization, user feedback
- State management — any global state updated post sign-up (auth store, user context, etc.)
- Type safety coverage — are all data shapes fully typed end-to-end with no `any`

Present this as an **annotated flow diagram in text format** before any code review begins.

---

**Phase 2 — File-by-File Quality Audit**

For every file identified in Phase 1, perform a deep quality review across these dimensions:

**Architecture & Separation of Concerns**
- Is business logic leaking into UI components?
- Are server and client boundaries correctly placed?
- Is the file doing more than one job?

**Code Quality**
- Are there magic strings, hardcoded values, or repeated logic that should be abstracted?
- Are all functions single-responsibility and appropriately named?
- Is there any dead code, unused imports, or redundant state?

**Type Safety**
- Are all props, function parameters, return types, and API responses fully typed?
- Is `any` used anywhere it should not be?
- Are Zod schemas or equivalent runtime validators present for all external data?

**Validation**
- Is client-side validation complete and user-friendly?
- Is server-side validation present and does it match client-side rules exactly?
- Are all edge cases handled — empty fields, special characters, duplicate emails, etc.?

**Error Handling**
- Are all error states caught — network failure, 400/409/500 responses, timeout?
- Are errors surfaced to the user in a clear, accessible, non-technical way?
- Are errors logged appropriately without exposing sensitive data?

**Performance**
- Is the sign-up component or page unnecessarily re-rendering?
- Are any heavy dependencies loaded synchronously that could be lazy loaded?
- Is there any unnecessary client-side state that could be server-driven?

**Security**
- Is sensitive data ever logged, exposed in URLs, or stored insecurely?
- Is the password field handled safely — never stored in plain state longer than necessary?
- Are there any XSS or injection risks in form inputs?
- Is the API route or Server Action protected against abuse (rate limiting, CSRF)?

**Accessibility**
- Are all form fields properly labeled with `<label>` or `aria-label`?
- Are error messages associated with their fields via `aria-describedby`?
- Is the form fully keyboard navigable?
- Are loading and success states announced to screen readers?

**Developer Experience**
- Are components and functions documented with JSDoc?
- Are file and variable names consistent with the rest of the codebase?
- Are there barrel exports where appropriate?

For each issue found, rate it as `CRITICAL`, `MAJOR`, or `MINOR` with a one-line fix description.

---

**Phase 3 — Automated Test Coverage Plan**

After the audit, design a **complete test suite** for the sign-up flow covering:

**Unit Tests** — for every utility function, validation schema, and pure logic involved in sign-up
**Component Tests** — for the sign-up form component using React Testing Library:
- Renders correctly in default state
- Shows validation errors on invalid submission
- Disables submit button during loading
- Shows success state after successful submission
- Shows correct error message for duplicate email (409)
- Shows generic error for server failure (500)
- Is fully accessible — labels, roles, error associations

**Integration Tests** — for the API route or Server Action:
- Accepts valid payload and returns correct response
- Rejects missing required fields with correct status and message
- Rejects duplicate email with `409` and descriptive message
- Handles unexpected DB errors gracefully with `500`

**E2E Tests** — using Playwright or Cypress (detect which is present or recommend if neither):
- Happy path: user fills valid form → submits → redirected to correct page
- Validation path: user submits empty form → all errors shown inline
- Duplicate email path: user submits existing email → correct error shown
- Network failure path: API is unreachable → user sees friendly error, form remains usable

Set up test files following the project's existing test conventions. If no test setup exists, scaffold Vitest + React Testing Library + Playwright with `yarn add -D` and minimal config.

---

**Phase 4 — Fixes & Optimizations**

Based on the audit findings:

- Fix all `CRITICAL` issues immediately with full corrected code
- Fix all `MAJOR` issues with full corrected code
- List `MINOR` issues with recommended fixes for later
- After every fix, explain in one line what was wrong and what the fix achieves

---

**Phase 5 — Senior-Engineer Checklist Sign-Off**

After all fixes are applied, run a final checklist and confirm each item as `✅ PASSED`, `⚠️ NEEDS ATTENTION`, or `❌ FAILED`:

- [ ] Flow is fully traceable from UI to API to DB and back
- [ ] All files have single, clear responsibilities
- [ ] End-to-end type safety with no `any`
- [ ] Client and server validation are in sync
- [ ] All error states are handled and user-facing
- [ ] No sensitive data exposed on client
- [ ] Form is fully accessible
- [ ] Performance — no unnecessary renders or bundle bloat
- [ ] Test coverage exists for critical paths
- [ ] Code is documented and consistent with codebase conventions

---

**Execution Rules:**

- Work **phase by phase** — do not proceed to the next phase without completing and presenting the current one
- After Phase 1, present the flow map and wait for confirmation before auditing
- After Phase 2, present the full audit report and wait for confirmation before writing any fixes
- If multiple valid approaches exist for a fix, present options with trade-offs and wait for a decision
- Never delete or replace code without showing the before and after side by side

---

**Output for Phase 1:** Begin immediately with the complete sign-up flow trace and annotated flow map. Do not audit or fix anything until the map is confirmed.
</details>
