export enum PaymentMethod {
  CARD = "CARD",
  SCAN_PAY = "SCAN_PAY",
  CASH_ON_DELIVERY = "CASH_ON_DELIVERY",
}

export interface IPromoCode {
  code: string;
  type: "FIXED" | "PERCENTAGE";
  value: number;
  label: string;
}
