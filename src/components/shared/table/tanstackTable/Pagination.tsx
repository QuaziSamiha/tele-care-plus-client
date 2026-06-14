
import React from "react";
import { GrFormPrevious } from "react-icons/gr";
import { GrFormNext } from "react-icons/gr";
import PaginationSkeleton from "./PaginationSkeleton";
import { ITablePagination } from "@/types/share-component.type";

export default function Pagination<T extends object>({
  table,
  totalItems,
  isLoading,
}: ITablePagination<T>) {
  // console.log(totalItems);
  const pageCount = Math.max(table.getPageCount(), 1);
  const currentPage = table.getState().pagination.pageIndex + 1;
  const pageSize = table.getState().pagination.pageSize;

  const fromRow = (currentPage - 1) * pageSize + 1;
  let toRow;
  if (totalItems) {
    toRow = Math.min(currentPage * pageSize, totalItems);
  }

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 3;
    if (pageCount <= 5) {
      return Array.from({ length: pageCount }, (_, i) => i + 1);
    }

    if (currentPage <= maxVisible) {
      pages.push(1, 2, 3, "...", pageCount);
    } else if (currentPage > pageCount - maxVisible) {
      pages.push(1, "...", pageCount - 2, pageCount - 1, pageCount);
    } else {
      pages.push(
        1,
        "...",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "...",
        pageCount
      );
    }

    return pages;
  };

  return isLoading ? (
    <PaginationSkeleton />
  ) : (
    <section className=" bg-white px-6 py-3">
      <div className="flex items-center justify-between mt-4">
        {/* Showing X–Y from Z */}
        <div className="flex gap-1 text-sm text-neutral-500 font-medium">
          <span>Showing</span>{" "}
          <span>
            {fromRow}-{toRow}
          </span>{" "}
          <span>from</span> <span>{totalItems}</span>
        </div>

        {/* Pagination buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="w-8 h-8 px-2 py-1 border rounded bg-mauve-800 text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <GrFormPrevious />
          </button>

          {getPageNumbers().map((page, idx) =>
            typeof page === "number" ? (
              <button
                key={idx}
                onClick={() => table.setPageIndex(page - 1)}
                // className={`w-8 h-8 px-2 py-1 border rounded text-white cursor-pointer bg-greenPrimary-500`}
                className={`w-8 h-8 px-2 py-1 border rounded text-white cursor-pointer ${
                  currentPage === page
                    ? " bg-mauve-800"
                    : "bg-mauve-600"
                }`}
              >
                {page}
              </button>
            ) : (
              <span key={idx} className="px-3">
                ...
              </span>
            )
          )}

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="w-8 h-8 px-2 py-1 border rounded bg-mauve-800 text-white disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed"
          >
            <GrFormNext />
          </button>
        </div>
      </div>{" "}
    </section>
  );
}
