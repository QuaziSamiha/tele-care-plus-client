import { ColumnDef } from "@tanstack/react-table";
import { IBlog } from "../types/blog.type";
import CustomTooltipPrimary from "@/components/shared/tooltip/CustomTooltipPrimary";
import { truncateText } from "@/lib/utils/truncateText";
import Image from "next/image";
import dayjs from "dayjs";

const statusStyles: Record<string, string> = {
  PUBLISHED: "text-green-600 bg-green-100",
  DRAFT: "text-blue-600 bg-blue-100",
  ARCHIVED: "text-yellow-600 bg-yellow-100",
};

export const getBlogColumns = (
  handleView: (data: IBlog) => void,
  handleEdit: (data: IBlog) => void,
): ColumnDef<IBlog>[] => [
  {
    accessorKey: "image",
    header: "Cover Image",
    enableSorting: false,
    cell: ({ row }) => {
      const src = row.original.imageUrl;
      if (!src) {
        return (
          <div className="w-16 h-10 rounded bg-neutral-100 flex items-center justify-center text-neutral-400 text-xs">
            —
          </div>
        );
      }
      return (
        <div className="relative w-16 h-10 rounded overflow-hidden border border-neutral-200 shrink-0">
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
    header: "Title",
    cell: ({ row }) => (
      <span className="text-sm font-medium text-slate-800">
        {truncateText(row.original.title, 40)}
      </span>
    ),
  },
  {
    accessorKey: "blogCategory",
    header: "Category",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {row.original.blogCategory || "—"}
      </span>
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
    accessorKey: "publishedAt",
    header: "Published Date",
    cell: ({ row }) => (
      <span className="text-sm text-slate-600">
        {row.original.publishedAt
          ? dayjs(row.original.publishedAt).format("MMM DD, YYYY")
          : "—"}
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
        <button onClick={() => handleEdit(row.original)}>
          <CustomTooltipPrimary action="edit" content="Edit" />
        </button>
      </div>
    ),
  },
];
