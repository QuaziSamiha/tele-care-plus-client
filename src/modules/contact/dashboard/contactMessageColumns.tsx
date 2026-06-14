import { ColumnDef } from "@tanstack/react-table";
import { IContactMessage } from "../types/contact.types";
import CustomTooltipPrimary from "@/components/shared/tooltip/CustomTooltipPrimary";

export const getContactMessageColumns = (
  handleView: (data: IContactMessage) => void,
  handleDelete: (data: IContactMessage) => void,
): ColumnDef<IContactMessage>[] => [
  {
    id: "serial",
    header: "Sl.",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-slate-500">
        {String(row.index + 1).padStart(2, "0")}
      </span>
    ),
  },
  {
    accessorKey: "name",
    header: "User Name",
    cell: ({ row }) => (
      <span
        className={`text-slate-700 ${!row.original.isRead ? "font-semibold" : ""}`}
      >
        {row.original.name}
      </span>
    ),
  },
  {
    accessorKey: "phone",
    header: "Number",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-slate-600">{row.original.phone ?? "—"}</span>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <span className="text-slate-600">{row.original.email}</span>
    ),
  },
  {
    accessorKey: "message",
    header: "Messages",
    enableSorting: false,
    cell: ({ row }) => (
      <span className="text-slate-500 line-clamp-2 max-w-xs block">
        {row.original.message}
      </span>
    ),
  },
  {
    accessorKey: "isRead",
    header: "Status",
    enableSorting: false,
    cell: ({ row }) =>
      row.original.isRead ? (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-green-100 text-green-600">
          Read
        </span>
      ) : (
        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-100 text-amber-600">
          Unread
        </span>
      ),
  },
  {
    id: "actions",
    header: "Action",
    enableSorting: false,
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <button onClick={() => handleView(row.original)}>
          <CustomTooltipPrimary action="view" content="View" />
        </button>
        <button onClick={() => handleDelete(row.original)}>
          <CustomTooltipPrimary action="delete" content="Delete" />
        </button>
      </div>
    ),
  },
];
