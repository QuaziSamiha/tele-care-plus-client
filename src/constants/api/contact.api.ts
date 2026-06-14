import { v } from "./_version";

export const CONTACT_API = {
  paths: {
    INFO: v("/contact/info"),
    MESSAGES: v("/contact/messages"),
    SEND: v("/contact/message"),
    DELETE_MESSAGE: (id: string | number) => v(`/contact/message/${id}`),
  },
  keys: {
    INFO: ["contact-info"] as const,
    MESSAGES: ["contact-messages"] as const,
  },
} as const;
