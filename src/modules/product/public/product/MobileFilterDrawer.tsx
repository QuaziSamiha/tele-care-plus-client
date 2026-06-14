"use client";

import { RxCross2 } from "react-icons/rx";
import ProductSidebar from "./ProductSidebar";
import { useProductFilter } from "../../hooks/useProductFilter";


export default function MobileFilterDrawer({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { clearFilters } = useProductFilter();

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-black/40 z-[9998] transition-opacity duration-300 lg:hidden ${
          isOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className={`fixed top-0 left-0 h-full w-[85%] max-w-[320px] bg-white z-[9999] shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}>
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-bold">Filters</h2>
          <button onClick={onClose} className="p-1 hover:bg-neutral-100 rounded-full">
            <RxCross2 className="text-2xl" />
          </button>
        </div>

        <div className="p-5 overflow-y-auto h-[calc(100vh-140px)]">
           {/* Reusing the same Sidebar component for logic consistency */}
           <ProductSidebar isMobile />
        </div>

        <div className="absolute bottom-0 left-0 w-full p-5 border-t bg-white">
          <button
            onClick={() => { clearFilters(); onClose(); }}
            className="w-full py-3 border border-neutral-300 rounded-md font-semibold text-neutral-700"
          >
            Clear All
          </button>
        </div>
      </div>
    </>
  );
}