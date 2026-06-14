"use client";

import { useState } from "react";
import { MdAdd, MdRemove } from "react-icons/md";
import { useTableModals } from "@/hooks/table/useTableModals";
import CustomTable from "@/components/shared/table/tanstackTable/CustomTable";
import CustomModalPrimary from "@/components/shared/modal/CustomModalPrimary";
import { IInventory } from "../types/inventory.type";
import { useGetAllInventory } from "../hooks/useInventory";
import { getInventoryColumns } from "./inventoryColumns";
import AddStock from "./AddStock";
import RemoveProduct from "./RemoveProduct";
import ViewInventory from "./ViewInventory";

export default function Inventory() {
  const [openAdd, setOpenAdd] = useState(false);
  const [openRemove, setOpenRemove] = useState(false);
  const { viewData, modals, setModal, handleView } =
    useTableModals<IInventory>();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const queryParams = {
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
    sortOrder,
  };

  const {
    data: inventoryData,
    isLoading: isInventoryLoading,
    refetch: refetchInventory,
  } = useGetAllInventory(queryParams);

  const columns = getInventoryColumns(handleView);

  return (
    <section className="flex flex-col gap-6">
      <section className="flex items-center justify-between">
        <p className="text-2xl font-semibold text-slate-800">Inventory</p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpenRemove(true)}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 font-semibold text-sm rounded px-5 py-2.5 cursor-pointer"
          >
            <MdRemove className="w-5 h-5" />
            Remove Product
          </button>
          <button
            type="button"
            onClick={() => setOpenAdd(true)}
            className="flex items-center gap-2 bg-mauve-700 hover:bg-mauve-700 text-white font-semibold text-sm rounded px-5 py-2.5 cursor-pointer"
          >
            <MdAdd className="w-5 h-5" />
            Add Stock
          </button>
        </div>
      </section>

      <CustomTable<IInventory>
        data={Array.isArray(inventoryData?.data) ? inventoryData.data : []}
        columns={columns}
        isLoading={isInventoryLoading}
        pageCount={inventoryData?.meta?.totalPages || 1}
        totalItems={inventoryData?.meta?.totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearchTerm}
        onSortChange={(_field, order) => setSortOrder(order)}
      />

      {/* Add Stock modal */}
      <CustomModalPrimary
        open={openAdd}
        onOpenChange={setOpenAdd}
        dialogWidth="w-[80vw] max-w-5xl"
      >
        <AddStock setOpen={setOpenAdd} refetch={refetchInventory} />
      </CustomModalPrimary>

      {/* Remove Product modal */}
      <CustomModalPrimary
        open={openRemove}
        onOpenChange={setOpenRemove}
        dialogWidth="w-[70vw] max-w-3xl"
      >
        <RemoveProduct setOpen={setOpenRemove} refetch={refetchInventory} />
      </CustomModalPrimary>

      {/* View modal */}
      <CustomModalPrimary
        open={modals.view}
        onOpenChange={setModal.view}
        dialogWidth="w-[80vw] max-w-4xl"
      >
        <ViewInventory data={viewData} setOpen={setModal.view} />
      </CustomModalPrimary>
    </section>
  );
}
