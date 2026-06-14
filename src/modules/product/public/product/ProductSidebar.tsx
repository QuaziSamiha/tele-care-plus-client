"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { usePublicCategories } from "@/modules/category/hooks/usePublicCategory";
import { useProductFilter } from "../../hooks/useProductFilter";
import { Skeleton } from "@/components/ui/skeleton";

const PRODUCT_TYPES = [
  { id: "SIMPLE", label: "Single Product" },
  { id: "COMBO", label: "Combo Set" },
];

interface SidebarProps {
  isMobile?: boolean;
}

export default function ProductSidebar({ isMobile }: SidebarProps) {
  const { rootCategories, getChildren, isLoading } = usePublicCategories();
  const { selectedCategoryIds, selectedProductType, updateFilter, clearFilters, isAnyFilterActive } =
    useProductFilter();

  const handleCategoryToggle = (id: number, checked: boolean) => {
    const next = checked
      ? [...selectedCategoryIds, id]
      : selectedCategoryIds.filter((prevId) => prevId !== id);
    updateFilter("categoryIds", next);
  };

  const handleProductTypeToggle = (typeId: string, checked: boolean) => {
    updateFilter("productType", checked ? typeId : "");
  };

  const defaultOpen = rootCategories.map((_, i) => `cat-${i}`);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b pb-4">
        {!isMobile && (
          <h2 className="text-lg font-bold text-slate-800">Filters</h2>
        )}
        {isAnyFilterActive && (
          <button
            onClick={clearFilters}
            className="text-xs text-primary-600 hover:text-primary-800 font-medium underline underline-offset-2 transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Category
        </p>

        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full rounded" />
            ))}
          </div>
        ) : (
          <Accordion
            type="multiple"
            defaultValue={defaultOpen}
            className="w-full"
          >
            {rootCategories.map((root, index) => {
              const children = getChildren(root.id);
              return (
                <AccordionItem
                  key={root.id}
                  value={`cat-${index}`}
                  className="border-none"
                >
                  <AccordionTrigger className="hover:no-underline py-2.5 text-sm font-semibold text-primary-600">
                    {root.name}
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col gap-3 ml-1 mt-1 mb-2">
                      {children.length === 0 ? (
                        <label className="flex items-center gap-3 cursor-pointer group">
                          <input
                            type="checkbox"
                            className="w-4 h-4 rounded border-slate-300 accent-primary-600"
                            checked={selectedCategoryIds.includes(root.id)}
                            onChange={(e) =>
                              handleCategoryToggle(root.id, e.target.checked)
                            }
                          />
                          <span className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors">
                            All {root.name}
                          </span>
                        </label>
                      ) : (
                        children.map((child) => (
                          <label
                            key={child.id}
                            className="flex items-center gap-3 cursor-pointer group"
                          >
                            <input
                              type="checkbox"
                              className="w-4 h-4 rounded border-slate-300 accent-primary-600"
                              checked={selectedCategoryIds.includes(child.id)}
                              onChange={(e) =>
                                handleCategoryToggle(child.id, e.target.checked)
                              }
                            />
                            <span className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors">
                              {child.name}
                            </span>
                          </label>
                        ))
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>

      {/* Divider */}
      <div className="border-t" />

      {/* Product Type Filter */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-3">
          Product Type
        </p>
        <div className="flex flex-col gap-3">
          {PRODUCT_TYPES.map((type) => (
            <label
              key={type.id}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-slate-300 accent-primary-600"
                checked={selectedProductType === type.id}
                onChange={(e) =>
                  handleProductTypeToggle(type.id, e.target.checked)
                }
              />
              <span className="text-slate-600 text-sm group-hover:text-slate-900 transition-colors flex items-center gap-2">
                {type.label}
                {type.id === "COMBO" && (
                  <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded">
                    COMBO
                  </span>
                )}
              </span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
