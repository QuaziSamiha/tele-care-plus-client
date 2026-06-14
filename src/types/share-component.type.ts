import { ReactNode } from "react";
import { ColumnDef, Table } from "@tanstack/react-table";
import { Control, FieldValues, Path, PathValue, UseFormTrigger } from "react-hook-form";
// ================== Custom Tab ==================
export interface ITabList {
  label: string;
  value: string;
}

export interface ITabContent {
  value: string;
  content: ReactNode;
}

export interface ICustomTabGroup {
  defaultTab?: string;
  tabList: ITabList[];
  tabContent: ITabContent[];
}

// ============= PAGINATION =============
export interface IPaginationMetaData {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface IPagination {
  metaData: IPaginationMetaData;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

// ================= TABLE ==============
export interface ICustomTable<T extends object> {
  data: T[];
  columns: ColumnDef<T, unknown>[];
  isLoading?: boolean;
  pageCount?: number;
  totalItems?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSearchChange?: (value: string) => void;
  onSortChange?: (field: string, order: "asc" | "desc") => void;
  searchPlaceholder?: string;
  showSearchbar?: boolean;
}

export interface ITablePagination<T extends object> {
  table: Table<T>;
  totalItems?: number;
  isLoading?: boolean;
}

// ========== TOOLTIP =============
export interface ICustomTooltip {
  action: string;
  content?: string;
}

// ======== TABLE MODAL ACTION =========
export interface ITableModals<T> {
  // Data for each modal
  viewData?: T;
  editData?: T;
  deleteData?: T;

  // State controls
  modals: {
    view: boolean;
    edit: boolean;
    delete: boolean;
  };

  // Setters for modal open/close
  setModal: {
    view: React.Dispatch<React.SetStateAction<boolean>>;
    edit: React.Dispatch<React.SetStateAction<boolean>>;
    delete: React.Dispatch<React.SetStateAction<boolean>>;
  };

  // Action handlers
  handleView: (rowData: T) => void;
  handleEdit: (rowData: T) => void;
  handleDelete: (rowData: T) => void;

  // Reset everything
  resetModals: () => void;
}

// ========== MODAL ==========
export interface ICustomModalPrimary {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  footerButton?: ReactNode;
  footerRequired?: boolean;
  dialogWidth?: string;
  dialogHeight?: string;
  children: ReactNode;
}

export interface IModal {
  setOpen?: (open: boolean) => void;
  refetch?: () => void;
  onClose?: () => void;
  data?: unknown;
  isLoading?: boolean;
}

// ========== BUTTON =========
export interface IAddButton {
  label: string;
  setOpen: (open: boolean) => void;
}
