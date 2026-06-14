import { ColumnDef } from "@tanstack/react-table";
import dayjs from "dayjs";
import CustomTooltipPrimary from "@/components/shared/tooltip/CustomTooltipPrimary";
import { IInventory, InventoryExchangeType } from "../types/inventory.type";

const changeTypeStyles: Record<InventoryExchangeType, string> = {
  [InventoryExchangeType.ADD]: "text-green-700 bg-green-100",
  [InventoryExchangeType.RESTOCK]: "text-green-700 bg-green-100",
  [InventoryExchangeType.SALE]: "text-blue-700 bg-blue-100",
  [InventoryExchangeType.RETURN]: "text-amber-700 bg-amber-100",
  [InventoryExchangeType.ADJUSTMENT]: "text-slate-700 bg-slate-100",
  [InventoryExchangeType.DAMAGE]: "text-red-700 bg-red-100",
  [InventoryExchangeType.EXPIRED]: "text-orange-700 bg-orange-100",
};

export const getInventoryColumns = (
  handleView: (data: IInventory) => void,
): ColumnDef<IInventory>[] => [
  {
    accessorKey: "product",
    header: "Product",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-slate-800">
          {row.original.product?.name ?? "—"}
        </span>
        {row.original.variant && (
          <span className="text-xs text-slate-400">
            {row.original.variant.size ?? row.original.variant.name}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "quantity",
    header: "Stock",
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-slate-800">
        {row.original.quantity}
      </span>
    ),
  },
  {
    accessorKey: "changeType",
    header: "Last Change",
    enableSorting: false,
    cell: ({ row }) => (
      <span
        className={`capitalize font-semibold text-xs w-fit rounded px-3 py-1 ${
          changeTypeStyles[row.original.changeType] ?? "text-gray-600 bg-gray-100"
        }`}
      >
        {row.original.changeType.toLowerCase()}
      </span>
    ),
  },
  {
    accessorKey: "reason",
    header: "Reason",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm text-slate-500 line-clamp-1 max-w-60">
        {row.original.reason ?? "—"}
      </span>
    ),
  },
  {
    accessorKey: "recordedAt",
    header: "Updated",
    cell: ({ row }) => (
      <span className="text-sm text-slate-500">
        {dayjs(row.original.recordedAt).format("MMM DD, YYYY")}
      </span>
    ),
  },
  {
    accessorKey: "actions",
    header: "Action",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button onClick={() => handleView(row.original)}>
          <CustomTooltipPrimary action="view" content="View" />
        </button>
      </div>
    ),
  },
];
