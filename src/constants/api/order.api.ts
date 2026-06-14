import { v } from "./_version";

export const ORDER_API = {
  paths: {
    ALL: v("/order/all-orders"),
    MY_ORDERS: v("/order/my-orders"),
    CREATE: v("/order/create-order"),
    UPDATE: (id: string | number) => v(`/order/update-order/${id}`),
  },
  keys: {
    ALL: ["orders"] as const,
    MY_ORDERS: ["orders", "my"] as const,
  },
} as const;
