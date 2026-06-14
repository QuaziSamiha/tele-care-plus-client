import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { IProduct } from "../types/product.type";
import CustomTooltipPrimary from "@/components/shared/tooltip/CustomTooltipPrimary";

const statusStyles: Record<string, string> = {
  ACTIVE: "text-green-600 bg-green-100",
  INACTIVE: "text-red-600 bg-red-100",
  DRAFT: "text-blue-600 bg-blue-100",
  ARCHIVED: "text-yellow-600 bg-yellow-100",
  HIDDEN: "text-gray-600 bg-gray-100",
};

export const getProductColumns = (
  handleView: (data: IProduct) => void,
  handleEdit: (data: IProduct) => void,
  handleDelete: (data: IProduct) => void,
): ColumnDef<IProduct>[] => [
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
            alt={row.original.name}
            fill
            className="object-cover"
          />
        </div>
      );
    },
  },
  {
    accessorKey: "name",
    header: "Product Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium text-slate-800">
          {row.original.name}
        </span>
        {row.original.nameTh && (
          <span className="text-xs text-slate-400">{row.original.nameTh}</span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {new Date(row.original.updatedAt).toLocaleDateString()}
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
