export enum InventoryExchangeType {
  ADD = "ADD",
  RESTOCK = "RESTOCK",
  SALE = "SALE",
  RETURN = "RETURN",
  ADJUSTMENT = "ADJUSTMENT",
  DAMAGE = "DAMAGE",
  EXPIRED = "EXPIRED",
}

export interface IBatch {
  id: number;
  sid: string;
  batchNo: string;
  quantity: number;
  remaining: number;
  manufacturingDate: string | null;
  expiryDate: string | null;
  productId: number | null;
  variantId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface IInventory {
  id: number;
  sid: string;
  quantity: number;
  changeType: InventoryExchangeType;
  reason: string | null;
  productId: number | null;
  variantId: number | null;
  recordedAt: string;
  product?: { id: number; name: string; slug: string } | null;
  variant?: { id: number; name: string; size: string | null } | null;
  batches?: IBatch[];
}
