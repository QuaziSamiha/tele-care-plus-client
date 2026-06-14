import { ColumnDef } from "@tanstack/react-table";
import { CategoryStatus, ICategory } from "../types/category.type";
import CustomTooltipPrimary from "@/components/shared/tooltip/CustomTooltipPrimary";
import { truncateText } from "@/lib/utils/truncateText";
import Image from "next/image";

const statusStyles: Record<CategoryStatus, string> = {
  [CategoryStatus.ACTIVE]: "text-green-600 bg-green-100",
  [CategoryStatus.INACTIVE]: "text-red-600 bg-red-100",
  [CategoryStatus.DRAFT]: "text-blue-600 bg-blue-100",
  [CategoryStatus.ARCHIVED]: "text-yellow-600 bg-yellow-100",
  [CategoryStatus.HIDDEN]: "text-gray-600 bg-gray-100",
};

function LevelBadge({ level, parentName }: { level: number; parentName?: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span
        className={`w-fit text-xs font-semibold px-2 py-0.5 rounded ${
          level === 0
            ? "bg-primary-100 text-mauve-800"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {level === 0 ? "Root" : `Level ${level}`}
      </span>
      {parentName && (
        <span className="text-xs text-slate-400 truncate max-w-30">
          ↳ {parentName}
        </span>
      )}
    </div>
  );
}

export const getCategoryColumns = (
  handleView: (data: ICategory) => void,
  handleEdit: (data: ICategory) => void,
): ColumnDef<ICategory>[] => [
  {
    accessorKey: "image",
    header: "Image",
    enableSorting: false,
    cell: ({ row }) => {
      const src = row.original.thumbnailUrl || row.original.bannerUrl;
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
    header: "Category Name",
    cell: ({ row }) => (
      <div className="flex flex-col gap-0.5">
        <span className="text-sm font-medium capitalize text-slate-800">
          {truncateText(row.original.name, 40)}
        </span>
        {row.original.nameTh && (
          <span className="text-xs text-slate-400">
            {truncateText(row.original.nameTh, 40)}
          </span>
        )}
      </div>
    ),
  },
  {
    accessorKey: "level",
    header: "Level",
    cell: ({ row }) => (
      <LevelBadge
        level={row.original.level}
        parentName={row.original.parent?.name}
      />
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
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
    accessorKey: "childrenCount",
    header: "Sub-cats",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-sm text-slate-700 text-center">
        {row.original.childrenCount ?? 0}
      </div>
    ),
  },
  {
    accessorKey: "productCount",
    header: "Products",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="text-sm text-slate-700 text-center">
        {row.original.productCount}
      </div>
    ),
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.isFeatured ? (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-600">
          Yes
        </span>
      ) : (
        <span className="text-xs text-slate-400">—</span>
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
      </div>
    ),
  },
];
