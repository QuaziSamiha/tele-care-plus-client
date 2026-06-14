```bash
import { jwtDecode } from "jwt-decode";

export const decodedToken = (token: string) => {
  return jwtDecode(token);
};
```

##### Alternative decoding function (manual base64 decoding)

```bash
export function decodeJWT(token: string) {
    try {
        return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
    } catch (error) {
        console.error("Failed to decode JWT manually:", error);
        return null;
    }
}
```

The code snippets provide utilities to read the data stored inside a **JSON Web Token (JWT)**. In your current tech stack, this is what allows your frontend to know the user's ID, role, or name without making a separate API call to the backend.

### How it works

A JWT consists of three parts separated by dots: `Header.Payload.Signature`. These functions specifically look at the **Payload**.

- **`decodedToken`**: Uses the popular `jwt-decode` library to extract the JSON object from the token. This is the safest and most standard way to do it.
- **`decodeJWT` (The Manual Way)**: This function demonstrates the "Senior Developer" understanding of how tokens work.
  1.  **`token.split(".")[1]`**: It grabs the second part of the string (the payload).
  2.  **`Buffer.from(..., "base64")`**: It converts the Base64Url encoded string back into readable bytes.
  3.  **`JSON.parse(...)`**: It converts that string into a JavaScript object you can actually use.

---

### Which one should you use?

Developer should stick with **`decodedToken`** (using the library) because it handles edge cases and different character encodings more reliably than a manual split.

### Where to keep this file

To keep your **Essence Lab** architecture clean, move this to:
**`src/modules/auth/services/jwt.ts`** or **`src/modules/auth/utils/jwt.ts`**.

For a senior-level architecture like the one you are building for **Essence Lab**, **`src/modules/auth/utils/jwt.ts`** is the better choice.

Here is the architectural reasoning to help you decide:

### 1. The Definition of a "Service" vs. "Utils"

- **Services (`/services`):** These typically contain **Business Logic** or **External API Interactions**. Since your `auth.service.ts` already handles the "heavy lifting" like communicating with NestJS, refreshing tokens, and logging out, it is the primary "Service."
- **Utils (`/utils`):** These are **Pure Functions**. A pure function takes an input (a string token) and returns an output (a decoded object) without changing anything else in the app or calling an API. JWT decoding is a classic utility.

### 2. Avoiding "Service Bloat"

If you put everything in `/services`, that folder will eventually become messy and hard to navigate. By moving JWT decoding to `/utils`, you keep your Service focused only on the "actions" (like `login` and `logout`).


### Final Optimized Folder Structure

Based on the files we have discussed, your **Auth Module** should look like this:

```text
src/modules/auth/
├── constants/
│   └── auth.constants.ts    # Contains AUTH_KEY
├── hooks/
│   └── useUserFullData.ts   # React hooks for user data
├── services/
│   └── auth.service.ts      # login, logout, getNewAccessToken
└── utils/
    └── jwt.ts               # decodedToken, decodeJWT
```

#### Why this is "Senior" level:

- **Separation of Concerns:** You’ve separated constants, UI logic (hooks), business logic (services), and helper logic (utils).
- **Scalability:** When you add **Natura Care** or more features to **Essence Lab**, any new developer can find exactly what they need in seconds.
- **Testability:** Pure functions in `/utils` are the easiest parts of a codebase to write unit tests for.


#### Important Security Note

**Decoding is not Validating.** These functions only _read_ the data; they do not check if the token is authentic or if it has been tampered with. Only your **NestJS backend** can truly validate the signature using your `JWT_SECRET`. On the frontend, we decode simply to display the user's name or protect routes in the UI.
