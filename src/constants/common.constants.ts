export const APP_NAME = "Essence Lab" as const;

export const COMMON_STATUS_OPTIONS = [
  { id: "ACTIVE", name: "Active" },
  { id: "INACTIVE", name: "Inactive" },
  { id: "ARCHIVED", name: "Archived" },
  { id: "DRAFT", name: "Draft" },
  { id: "HIDDEN", name: "Hidden" },
] as const;
