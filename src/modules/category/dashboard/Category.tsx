"use client";

import { useGetAll } from "@/hooks/api/useGetAll";
import { useState } from "react";
import { ICategory } from "../types/category.type";
import { IMeta } from "@/types/response.type";
import { CATEGORY_API } from "@/constants/api";
import { useTableModals } from "@/hooks/table/useTableModals";
import { getCategoryColumns } from "./categoryColumns";
import CustomTable from "@/components/shared/table/tanstackTable/CustomTable";
import AddButton from "@/components/shared/button/AddButton";
import AddCategory from "./AddCategory";
import CustomModalPrimary from "@/components/shared/modal/CustomModalPrimary";
import EditCategory from "./EditCategory";
import ViewCategory from "./ViewCategory";

export default function Category() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { viewData, editData, modals, setModal, handleView, handleEdit } =
    useTableModals<ICategory>();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const queryParams = {
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
    sortOrder: sortOrder || undefined,
  };

  const {
    data: categoryData,
    isLoading: isCategoryLoading,
    refetch: refetchCategory,
  } = useGetAll<{ data: ICategory[]; meta: IMeta }>(
    CATEGORY_API.paths.ALL,
    [
      "getCategoryMeta",
      String(currentPage),
      String(pageSize),
      searchTerm,
      sortOrder,
    ],
    queryParams,
  );

  const columns = getCategoryColumns(handleView, handleEdit);

  return (
    <section className="flex flex-col gap-6">
      <section className="flex items-center justify-between">
        <p className="text-2xl font-semibold text-slate-800">Category</p>
        <AddButton label="Add Category" setOpen={setOpenModal} />

        <CustomModalPrimary
          open={openModal}
          onOpenChange={setOpenModal}
          dialogWidth="w-[60vw]"
        >
          <AddCategory setOpen={setOpenModal} refetch={refetchCategory} />
        </CustomModalPrimary>
      </section>

      <CustomTable<ICategory>
        data={Array.isArray(categoryData?.data) ? categoryData.data : []}
        columns={columns}
        isLoading={isCategoryLoading}
        pageCount={categoryData?.meta?.totalPages || 1}
        totalItems={categoryData?.meta?.totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearchTerm}
        onSortChange={(_field, order) => {
          setSortOrder(order);
        }}
      />

      <CustomModalPrimary
        open={modals.view}
        onOpenChange={setModal.view}
        dialogWidth="w-[60vw]"
      >
        <ViewCategory data={viewData} setOpen={setModal.view} />
      </CustomModalPrimary>
      <CustomModalPrimary
        open={modals.edit}
        onOpenChange={setModal.edit}
        dialogWidth="w-[60vw]"
      >
        <EditCategory data={editData} setOpen={setModal.edit} refetch={refetchCategory} isLoading={isCategoryLoading} />
      </CustomModalPrimary>
    </section>
  );
}
