import { v } from "./_version";

//* AUTH IS MUTATION-ONLY — NO QUERY KEYS NEEDED
export const AUTH_API = {
  paths: {
    LOGIN: v("/auth/login"),
    SOCIAL: v("/auth/social-auth"),
    REFRESH: v("/auth/refresh"),
    LOGOUT: v("/auth/logout"),
  },
} as const;
