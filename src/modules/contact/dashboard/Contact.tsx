"use client";

import { useState } from "react";
import { LuPencil } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import CustomTabGroup from "@/components/shared/customTab/CustomTabGroup";
import CustomModalPrimary from "@/components/shared/modal/CustomModalPrimary";
import CustomTable from "@/components/shared/table/tanstackTable/CustomTable";
import { axiosInstance } from "@/lib/axios/axiosInstance";
import { useContactInfo, useContactMessages } from "../hooks/useContact";
import { CONTACT_API } from "@/constants/api";
import { useTableModals } from "@/hooks/table/useTableModals";
import { IContactMessage } from "../types/contact.types";
import { getContactMessageColumns } from "./contactMessageColumns";
import EditContactInfo from "./EditContactInfo";
import ViewMessage from "./ViewMessage";

// ─── Contact Information Tab ──────────────────────────────────────────────────

function ContactInformationTab() {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const { data: response, isLoading } = useContactInfo();
  const info = response?.data;

  return (
    <div className="w-full">
      <div className="bg-white rounded border border-neutral-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-base font-bold text-slate-700">
            Contact Information
          </h3>
          <button
            onClick={() => setIsEditOpen(true)}
            className="flex items-center gap-2 border border-neutral-300 text-slate-600 text-sm font-semibold px-4 py-2 rounded hover:bg-neutral-50 transition-colors cursor-pointer"
          >
            <LuPencil size={14} />
            Edit
          </button>
        </div>

        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 bg-neutral-100 rounded" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            <div className="grid grid-cols-2 gap-8 py-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Hotline Number</p>
                <p className="text-sm font-semibold text-slate-700">
                  {info?.hotline ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Line ID</p>
                <p className="text-sm font-semibold text-slate-700">
                  {info?.lineId ?? "—"}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-8 py-4">
              <div>
                <p className="text-xs text-slate-400 mb-1">Email</p>
                <p className="text-sm font-semibold text-slate-700">
                  {info?.email ?? "—"}
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-400 mb-1">Heading</p>
                <p className="text-sm font-semibold text-slate-700">
                  {info?.heading ?? "—"}
                </p>
              </div>
            </div>
            <div className="py-4">
              <p className="text-xs text-slate-400 mb-2">Description</p>
              <p className="text-sm text-slate-600 leading-relaxed">
                {info?.description ?? "—"}
              </p>
            </div>
          </div>
        )}
      </div>

      <CustomModalPrimary
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        dialogWidth="w-[560px]"
        dialogHeight="max-h-[90vh]"
        footerRequired={false}
      >
        <EditContactInfo data={info} onClose={() => setIsEditOpen(false)} />
      </CustomModalPrimary>
    </div>
  );
}

// ─── Messages Tab ─────────────────────────────────────────────────────────────

function MessagesTab() {
  const queryClient = useQueryClient();
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  const { viewData, deleteData, modals, setModal, handleView, handleDelete } =
    useTableModals<IContactMessage>();

  const { data: messagesData, isLoading } = useContactMessages({
    page: currentPage,
    limit: pageSize,
    search: searchTerm || undefined,
  });

  const { mutate: deleteMsg, isPending: isDeleting } = useMutation({
    mutationFn: (id: number) =>
      axiosInstance.delete(CONTACT_API.paths.DELETE_MESSAGE(id)),
    onSuccess: () => {
      toast.success("Message deleted");
      setModal.delete(false);
      void queryClient.invalidateQueries({ queryKey: CONTACT_API.keys.MESSAGES });
    },
    onError: () => toast.error("Failed to delete message"),
  });

  const columns = getContactMessageColumns(handleView, handleDelete);

  return (
    <section className="flex flex-col gap-6">
      <CustomTable<IContactMessage>
        data={Array.isArray(messagesData?.data) ? messagesData.data : []}
        columns={columns}
        isLoading={isLoading}
        pageCount={messagesData?.meta?.totalPages ?? 1}
        totalItems={messagesData?.meta?.totalItems}
        pageSize={pageSize}
        onPageChange={setCurrentPage}
        onPageSizeChange={setPageSize}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search messages..."
      />

      {/* View Modal */}
      <CustomModalPrimary
        open={modals.view}
        onOpenChange={setModal.view}
        dialogWidth="w-[560px]"
        dialogHeight="max-h-[90vh]"
        footerRequired={false}
      >
        <ViewMessage data={viewData} setOpen={setModal.view} />
      </CustomModalPrimary>

      {/* Delete Confirmation Modal */}
      <CustomModalPrimary
        open={modals.delete}
        onOpenChange={setModal.delete}
        dialogWidth="w-[400px]"
        footerRequired={false}
      >
        <div className="flex flex-col gap-5 p-6">
          <h2 className="text-lg font-bold text-slate-800">Delete Message</h2>
          <p className="text-sm text-slate-600">
            Are you sure you want to delete the message from{" "}
            <span className="font-semibold">{deleteData?.name}</span>? This
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
              onClick={() => deleteData && deleteMsg(deleteData.id)}
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

// ─── Main Contact Dashboard ───────────────────────────────────────────────────

export default function Contact() {
  return (
    <div className="w-full p-6">
      <CustomTabGroup
        defaultTab="info"
        tabList={[
          { value: "info", label: "Contact Information" },
          { value: "messages", label: "Messages" },
        ]}
        tabContent={[
          { value: "info", content: <ContactInformationTab /> },
          { value: "messages", content: <MessagesTab /> },
        ]}
      />
    </div>
  );
}
