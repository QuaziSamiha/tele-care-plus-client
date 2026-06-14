import { ISingleSelectOption } from "@/types/form.type";
import { IPromoCode, PaymentMethod } from "../types/checkout.type";

export const CHECKOUT_STATES: ISingleSelectOption[] = [
  { id: "bangkok", name: "Bangkok" },
  { id: "chiang-mai", name: "Chiang Mai" },
  { id: "chonburi", name: "Chonburi" },
  { id: "phuket", name: "Phuket" },
  { id: "khon-kaen", name: "Khon Kaen" },
  { id: "nakhon-ratchasima", name: "Nakhon Ratchasima" },
];

export const CHECKOUT_REGIONS: Record<string, ISingleSelectOption[]> = {
  bangkok: [
    { id: "bangkok-pathum-wan", name: "Pathum Wan" },
    { id: "bangkok-watthana", name: "Watthana" },
    { id: "bangkok-bang-rak", name: "Bang Rak" },
  ],
  "chiang-mai": [
    { id: "chiang-mai-mueang", name: "Mueang Chiang Mai" },
    { id: "chiang-mai-hang-dong", name: "Hang Dong" },
  ],
  chonburi: [
    { id: "chonburi-mueang", name: "Mueang Chonburi" },
    { id: "chonburi-pattaya", name: "Pattaya" },
  ],
  phuket: [
    { id: "phuket-mueang", name: "Mueang Phuket" },
    { id: "phuket-kathu", name: "Kathu" },
  ],
  "khon-kaen": [{ id: "khon-kaen-mueang", name: "Mueang Khon Kaen" }],
  "nakhon-ratchasima": [
    { id: "nakhon-ratchasima-mueang", name: "Mueang Nakhon Ratchasima" },
  ],
};

export const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
  { value: PaymentMethod.CARD, label: "Card" },
  { value: PaymentMethod.SCAN_PAY, label: "ScanPay" },
  { value: PaymentMethod.CASH_ON_DELIVERY, label: "Cash on delivery" },
];

export const PROMO_CODES: IPromoCode[] = [
  {
    code: "WELCOME10",
    type: "PERCENTAGE",
    value: 10,
    label: "10% off your order",
  },
  {
    code: "HEALTH50",
    type: "FIXED",
    value: 50,
    label: "฿50 off your order",
  },
];
