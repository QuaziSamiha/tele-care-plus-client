"use client";

import { useGetAll } from "@/hooks/api/useGetAll";
import { useState } from "react";
import { IBlog } from "../types/blog.type";
import { IMeta } from "@/types/response.type";
import { BLOG_API } from "@/constants/api";
import { useTableModals } from "@/hooks/table/useTableModals";
import { getBlogColumns } from "./blogColumns";
import CustomTable from "@/components/shared/table/tanstackTable/CustomTable";
import AddButton from "@/components/shared/button/AddButton";
import AddBlog from "./AddBlog";
import CustomModalPrimary from "@/components/shared/modal/CustomModalPrimary";
import EditBlog from "./EditBlog";
import ViewBlog from "./ViewBlog";

export default function Blog() {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const { viewData, editData, modals, setModal, handleView, handleEdit } =
    useTableModals<IBlog>();

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
    data: blogData,
    isLoading: isBlogLoading,
    refetch: refetchBlog,
  } = useGetAll<{ data: IBlog[]; meta: IMeta }>(
    BLOG_API.paths.ALL,
    [
      "getBlogMeta",
      String(currentPage),
      String(pageSize),
      searchTerm,
      sortOrder,
    ],
    queryParams,
  );

  const columns = getBlogColumns(handleView, handleEdit);

  return (
    <section className="flex flex-col gap-6">
      <section className="flex items-center justify-between">
        <p className="text-2xl font-semibold text-slate-800">Blog</p>
        <AddButton label="Add Blog" setOpen={setOpenModal} />

        <CustomModalPrimary
          open={openModal}
          onOpenChange={setOpenModal}
          dialogWidth="w-[90vw] max-w-5xl"
        >
          <AddBlog setOpen={setOpenModal} refetch={refetchBlog} />
        </CustomModalPrimary>
      </section>

      <CustomTable<IBlog>
        data={Array.isArray(blogData?.data) ? blogData.data : []}
        columns={columns}
        isLoading={isBlogLoading}
        pageCount={blogData?.meta?.totalPages || 1}
        totalItems={blogData?.meta?.totalItems}
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
        dialogWidth="w-[90vw] max-w-5xl"
      >
        <ViewBlog data={viewData} setOpen={setModal.view} />
      </CustomModalPrimary>
      
      <CustomModalPrimary
        open={modals.edit}
        onOpenChange={setModal.edit}
        dialogWidth="w-[90vw] max-w-5xl"
      >
        <EditBlog data={editData} setOpen={setModal.edit} refetch={refetchBlog} />
      </CustomModalPrimary>
    </section>
  );
}
