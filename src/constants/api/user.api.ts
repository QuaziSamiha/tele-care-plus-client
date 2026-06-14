import { v } from "./_version";

export const USER_API = {
  paths: {
    CREATE: v("/user/create-user"),
  },
} as const;
