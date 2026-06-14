"use client";

import dayjs from "dayjs";
import { IModal } from "@/types/share-component.type";
import { useGetInventoryDetail } from "../hooks/useInventory";
import { IInventory } from "../types/inventory.type";

export default function ViewInventory({
  data,
  setOpen,
}: IModal & { data?: IInventory | null }) {
  const { data: detail, isLoading } = useGetInventoryDetail(data?.id);
  const inv = detail?.data ?? data;

  if (!inv) return null;

  return (
    <section className="p-6 flex flex-col gap-6 w-full max-h-[85vh] overflow-y-auto">
      <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
        <p className="text-2xl font-semibold text-slate-800">
          Inventory Details
        </p>
        <button
          onClick={() => setOpen?.(false)}
          className="text-neutral-500 hover:text-neutral-700"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Stat label="Product" value={inv.product?.name ?? "—"} />
        <Stat
          label="Variant"
          value={inv.variant?.size ?? inv.variant?.name ?? "—"}
        />
        <Stat label="Current Stock" value={String(inv.quantity)} />
        <Stat label="Last Change" value={inv.changeType.toLowerCase()} />
      </div>

      {inv.reason && (
        <div className="bg-neutral-50 rounded p-4 text-sm text-slate-600">
          <span className="font-semibold text-slate-800">Reason:</span>{" "}
          {inv.reason}
        </div>
      )}

      {/* Batches */}
      <div className="flex flex-col gap-3">
        <h3 className="text-lg font-bold text-slate-800">Batches</h3>
        {isLoading ? (
          <p className="text-slate-400 text-sm">Loading batches…</p>
        ) : inv.batches && inv.batches.length > 0 ? (
          <div className="border border-neutral-200 rounded overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-neutral-50">
                <tr className="border-b border-neutral-200 text-left">
                  <th className="py-2 px-3 font-semibold text-slate-500">
                    Batch No
                  </th>
                  <th className="py-2 px-3 font-semibold text-slate-500">
                    Initial Qty
                  </th>
                  <th className="py-2 px-3 font-semibold text-slate-500">
                    Remaining
                  </th>
                  <th className="py-2 px-3 font-semibold text-slate-500">
                    Manufactured
                  </th>
                  <th className="py-2 px-3 font-semibold text-slate-500">
                    Expiry
                  </th>
                </tr>
              </thead>
              <tbody>
                {inv.batches.map((b) => (
                  <tr key={b.id} className="border-b border-neutral-100 last:border-0">
                    <td className="py-2 px-3 text-slate-700 font-medium">
                      {b.batchNo}
                    </td>
                    <td className="py-2 px-3 text-slate-700">{b.quantity}</td>
                    <td className="py-2 px-3 text-slate-700">{b.remaining}</td>
                    <td className="py-2 px-3 text-slate-500">
                      {b.manufacturingDate
                        ? dayjs(b.manufacturingDate).format("MMM DD, YYYY")
                        : "—"}
                    </td>
                    <td className="py-2 px-3 text-slate-500">
                      {b.expiryDate
                        ? dayjs(b.expiryDate).format("MMM DD, YYYY")
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-slate-400 text-sm">No batches recorded.</p>
        )}
      </div>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-neutral-500 text-xs font-medium uppercase tracking-wider">
        {label}
      </span>
      <span className="text-slate-800 font-semibold capitalize">{value}</span>
    </div>
  );
}
