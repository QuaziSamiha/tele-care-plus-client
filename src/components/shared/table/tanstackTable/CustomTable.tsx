"use client";
import  { useEffect, useMemo, useState } from "react";
import {
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import Pagination from "./Pagination";
import TableSkeleton from "./TableSkeleton";
import {
  LuArrowDown,
  LuArrowUp,
  LuArrowUpDown,
  LuSearch,
} from "react-icons/lu";
import { ICustomTable } from "@/types/share-component.type";
import { debounce } from "lodash-es";

export default function CustomTable<T extends object>({
  data,
  columns,
  isLoading,
  pageCount,
  totalItems,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSortChange,
  searchPlaceholder = "Search...",
  showSearchbar = true,
}: ICustomTable<T>) {
  const [globalFilter, setGlobalFilter] = useState("");
  // console.log(globalFilter);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState({
    pageIndex: 0, //? CURRENT PAGE
    pageSize: pageSize, //? LIMIT
  });

  //* Debounce
  //? Without useMemo, the debounce() function would be recreated on every render, resetting its internal timer — and debounce wouldn’t actually work properly.
  const debouncedSearch = useMemo(
    () =>
      //* creates a “debounced” function that waits 500 ms after the last keystroke before calling onSearchChange
      debounce((value: string) => {
        onSearchChange?.(value);
      }, 500),
    [onSearchChange],
  );

  useEffect(() => {
    debouncedSearch(globalFilter); //* Whenever the user types (i.e., globalFilter changes), Call the debouncedSearch function with the current text. But because it’s debounced, the actual onSearchChange won’t run immediately — only after 500 ms of no typing.
  }, [globalFilter, debouncedSearch]);

  useEffect(() => {
    onPageChange?.(pagination.pageIndex + 1);
    onPageSizeChange?.(pagination.pageSize);
  }, [pagination, onPageChange, onPageSizeChange]);

  const table = useReactTable({
    data,
    columns,
    state: {
      globalFilter,
      pagination,
      sorting,
    },
    manualPagination: true,
    manualSorting: true,
    pageCount,
    onPaginationChange: setPagination,
    onSortingChange: (update) => {
      const newSorting = update instanceof Function ? update(sorting) : update;
      setSorting(newSorting);
      if (newSorting[0]) {
        const { id, desc } = newSorting[0];
        onSortChange?.(id, desc ? "desc" : "asc");
      }
    },
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onGlobalFilterChange: setGlobalFilter,
  });

  return (
    <section className="flex flex-col gap-4">
      {showSearchbar && (
        <section className="border border-neutral-50 rounded-lg bg-white p-3">
          {/* //? ================ SEARCH | FILTER ============= */}
          <div className="flex items-center w-full md:w-1/3 border rounded-lg bg-neutral-50 px-4 py-2">
            <LuSearch className="text-slate-500" />
            <input
              type="text"
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              placeholder={searchPlaceholder}
              className="text-slate-600 w-full px-3 outline-none placeholder:text-slate-400 text-base"
            />
          </div>
        </section>
      )}

      {/* Table */}
      <section className="overflow-x-auto scroll-auto rounded-lg border bg-white">
        <table className="min-w-full border-collapse">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup, index) => (
              <tr key={index} className="">
                {headerGroup.headers.map((header, index) => {
                  const canSort = header.column.getCanSort();
                  return (
                    <th
                      key={index}
                      className={`select-none text-sm font-semibold text-start text-slate-700 border-b border-gray-100 py-2.5 px-6 ${
                        canSort ? "cursor-pointer" : ""
                      }`}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler?.()
                          : undefined
                      }
                    >
                      <span className="inline-flex items-center gap-1">
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {canSort && (
                          <span className="text-slate-400 transition-colors">
                            {
                              {
                                asc: <LuArrowUp className="text-gray-600" />,
                                desc: <LuArrowDown className="text-gray-600" />,
                                false: (
                                  <LuArrowUpDown className="text-gray-400" />
                                ),
                              }[header.column.getIsSorted() as string]
                            }
                          </span>
                        )}
                      </span>
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>

          <tbody className="bg-white">
            {isLoading ? (
              <TableSkeleton columns={columns.length} rows={8} />
            ) : table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-b">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-slate-500 font-medium"
                >
                  <div className="flex flex-col items-center gap-2">
                    <div className="text-lg">📭</div>
                    <div>No data found</div>
                    {globalFilter && (
                      <div className="text-sm text-slate-400">
                        No results match &quot;{globalFilter}&quot;
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
      {/* //? ============ PAGINATION ========== */}
      <Pagination table={table} totalItems={totalItems} />
    </section>
  );
}
