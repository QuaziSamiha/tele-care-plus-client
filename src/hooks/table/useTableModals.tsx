import { ITableModals } from "@/types/share-component.type";
import { useState } from "react";

export function useTableModals<T>(): ITableModals<T> {
  const [viewData, setViewData] = useState<T | undefined>();
  const [editData, setEditData] = useState<T | undefined>();
  const [deleteData, setDeleteData] = useState<T | undefined>();

  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleView = (rowData: T) => {
    setViewData(rowData);
    setIsViewOpen(true);
  };

  const handleEdit = (rowData: T) => {
    setEditData(rowData);
    setIsEditOpen(true);
  };

  const handleDelete = (rowData: T) => {
    setDeleteData(rowData);
    setIsDeleteOpen(true);
  };

  const resetModals = () => {
    setViewData(undefined);
    setEditData(undefined);
    setDeleteData(undefined);
    setIsViewOpen(false);
    setIsEditOpen(false);
    setIsDeleteOpen(false);
  };

  return {
    viewData,
    editData,
    deleteData,
    modals: {
      view: isViewOpen,
      edit: isEditOpen,
      delete: isDeleteOpen,
    },
    setModal: {
      view: setIsViewOpen,
      edit: setIsEditOpen,
      delete: setIsDeleteOpen,
    },
    handleView,
    handleEdit,
    handleDelete,
    resetModals,
  };
}
