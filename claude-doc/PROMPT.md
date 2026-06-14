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