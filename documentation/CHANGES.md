

<details>
<summary>env.config.ts (prev file envConfig.ts)</summary>

| What it does                 | Previous Way (process.env)                                                                     | Current Way (T3 Env)                                                                                   |
| :--------------------------- | :--------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **When it catches mistakes** | **Too late.** It crashes while a user is actively using your website in production.            | **Instantly.** It stops the project from building or deploying if a variable is missing.               |
| **Typo Protection**          | **None.** If you type `process.env.GOOGL_ID` (missing an 'E'), it fails silently.              | **Full Autocomplete.** Your code editor will suggest the exact name and catch typos immediately.       |
| **Hacker Protection**        | **Risky.** It was easy to accidentally leak your secret passwords to the user's browser.       | **Locked Down.** It separates "Server secrets" from "Client data" so secrets can never escape.         |
| **Data Cleaning**            | **None.** If a URL is broken or missing `http://`, the app accepts it anyway and breaks later. | **Automatic Checklist.** It uses Zod to double-check that URLs are actually valid URLs before running. |
| **Fallback Cleanliness**     | **Messy.** Code looks cluttered with inline backups like `process.env.URL \|\| 'localhost'`.   | **Clean.** All default fallback values are cleanly written in one single configuration list.           |

</details>


<details>
<summary></summary>
</details>

<details>
<summary></summary>
</details>

<details>
<summary></summary>
</details>

<details>
<summary></summary>
</details>
