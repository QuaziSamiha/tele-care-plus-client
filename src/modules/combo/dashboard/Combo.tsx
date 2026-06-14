"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import { useTableModals } from "@/hooks/table/useTableModals";
import CustomTable from "@/components/shared/table/tanstackTable/CustomTable";
import AddButton from "@/components/shared/button/AddButton";
import CustomModalPrimary from "@/components/shared/modal/CustomModalPrimary";
import { ICombo } from "../types/combo.type";
import { getComboColumns } from "./comboColumns";
import AddCombo from "./AddCombo";
import EditCombo from "./EditCombo";
import ViewCombo from "./ViewCombo";
import useAdminCombo from "../hooks/useAdminCombo";

export default function Combo() {
  const [openAddModal, setOpenAddModal] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {
    viewData,
    editData,
    deleteData,
    modals,
    setModal,
    handleView,
    handleEdit,
    handleDelete,
  } = useTableModals<ICombo>();

  const queryClient = useQueryClient();

  const { comboData, isAllComboLoading, refetchAllCombo } = useAdminCombo({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
    sortOrder,
  });

  const { mutate: deleteCombo, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) => axiosInstance.delete(`/combo/delete/${id}`),
    onSuccess: () => {
      toast.success("Combo deleted successfully");
      setModal.delete(false);
      void queryClient.invalidateQueries({ queryKey: ["getAllCombos"] });
    },
    onError: () => toast.error("Failed to delete combo"),
  });

  const columns = getComboColumns(handleView, handleEdit, handleDelete);

  return (
    <section className="flex flex-col gap-6">
      <section className="flex items-center justify-between">
        <p className="text-2xl font-semibold text-slate-800">Combo Products</p>
        <AddButton label="Add Combo" setOpen={setOpenAddModal} />

        <CustomModalPrimary
          open={openAddModal}
          onOpenChange={setOpenAddModal}
          dialogWidth="w-[90vw]"
          dialogHeight="max-h-[80vh]"
        >
          <AddCombo setOpen={setOpenAddModal} refetch={refetchAllCombo} />
        </CustomModalPrimary>
      </section>

      <CustomTable<ICombo>
        data={Array.isArray(comboData?.data) ? comboData.data : []}
        columns={columns}
        isLoading={isAllComboLoading}
        pageCount={comboData?.meta?.totalPages ?? 1}
        totalItems={comboData?.meta?.totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearchTerm}
        onSortChange={(_field, order) => setSortOrder(order)}
        searchPlaceholder="Search combos..."
      />

      {/* View Modal */}
      <CustomModalPrimary
        open={modals.view}
        onOpenChange={setModal.view}
        dialogWidth="w-[90vw]"
        dialogHeight="max-h-[80vh]"
      >
        <ViewCombo data={viewData} setOpen={setModal.view} />
      </CustomModalPrimary>

      {/* Edit Modal */}
      <CustomModalPrimary
        open={modals.edit}
        onOpenChange={setModal.edit}
        dialogWidth="w-[90vw]"
        dialogHeight="max-h-[80vh]"
      >
        <EditCombo
          data={editData}
          setOpen={setModal.edit}
          refetch={refetchAllCombo}
        />
      </CustomModalPrimary>

      {/* Delete Confirmation Modal */}
      <CustomModalPrimary
        open={modals.delete}
        onOpenChange={setModal.delete}
        dialogWidth="w-[400px]"
        footerRequired={false}
      >
        <div className="flex flex-col gap-5 p-6">
          <h2 className="text-lg font-bold text-slate-800">Delete Combo</h2>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete{" "}
            <span className="font-semibold">{deleteData?.title}</span>? This
            action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setModal.delete(false)}
              className="border border-neutral-300 text-neutral-600 font-semibold px-5 py-2 rounded cursor-pointer hover:bg-neutral-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={() => deleteData && deleteCombo(deleteData.id)}
              className="bg-red-500 text-white font-semibold px-5 py-2 rounded cursor-pointer hover:bg-red-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </CustomModalPrimary>
    </section>
  );
}
