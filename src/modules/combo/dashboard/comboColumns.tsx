import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { ICombo } from "../types/combo.type";
import CustomTooltipPrimary from "@/components/shared/tooltip/CustomTooltipPrimary";

const statusStyles: Record<string, string> = {
  ACTIVE: "text-green-600 bg-green-100",
  INACTIVE: "text-red-600 bg-red-100",
  DRAFT: "text-blue-600 bg-blue-100",
  ARCHIVED: "text-yellow-600 bg-yellow-100",
  HIDDEN: "text-gray-600 bg-gray-100",
};

function fmtDate(d?: string | Date) {
  if (!d) return "—";
  const date = typeof d === "string" ? new Date(d) : d;
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
}

export const getComboColumns = (
  handleView: (data: ICombo) => void,
  handleEdit: (data: ICombo) => void,
  handleDelete: (data: ICombo) => void,
): ColumnDef<ICombo>[] => [
  {
    accessorKey: "image",
    header: "Image",
    enableSorting: false,
    cell: ({ row }) => {
      const src = row.original.images?.[0]?.url;
      if (!src) {
        return (
          <div className="w-10 h-10 rounded bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">
            —
          </div>
        );
      }
      return (
        <div className="relative w-10 h-10 rounded overflow-hidden border border-neutral-200 shrink-0">
          <Image
            src={src}
            alt={row.original.title}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "title",
    header: "Combo Title",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-slate-800">
          {row.original.title}
        </span>
        {row.original.titleTh && (
          <span className="text-xs text-slate-400">{row.original.titleTh}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "comboPrice",
    header: "Combo Price",
    cell: ({ row }) => {
      const { totalPrice, comboPrice } = row.original;
      return (
        <div className="flex flex-col">
          <span className="text-sm font-semibold text-slate-800">
            ฿{comboPrice.toFixed(2)}
          </span>
          {totalPrice > comboPrice && (
            <span className="text-xs text-slate-400 line-through">
              ฿{totalPrice.toFixed(2)}
            </span>
          )}
        </div>
      );
    },
  },
  {
    accessorKey: "items",
    header: "Products",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {row.original.items?.length ?? 0}
      </span>
    ),
  },
  {
    accessorKey: "window",
    header: "Window",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-xs text-slate-600">
        {fmtDate(row.original.startsAt)} → {fmtDate(row.original.endsAt)}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) => (
      <div
        className={`capitalize font-semibold text-xs w-fit rounded px-3 py-1 ${
          statusStyles[row.original.status] ?? "text-gray-600 bg-gray-100"
        }`}
      >
        {row.original.status.toLowerCase()}
      </div>
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
        <button onClick={() => handleEdit(row.original)}>
          <CustomTooltipPrimary action="edit" content="Edit" />
        </button>
        <button onClick={() => handleDelete(row.original)}>
          <CustomTooltipPrimary action="delete" content="Delete" />
        </button>
      </div>
    ),
  },
];
