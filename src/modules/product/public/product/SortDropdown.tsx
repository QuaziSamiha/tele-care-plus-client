"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type SortValue = "price_asc" | "price_desc" | "newest";

const SORT_OPTIONS: Record<
  SortValue,
  { label: string; sortBy: "basePrice" | "createdAt"; sortOrder: "asc" | "desc" }
> = {
  price_asc: { label: "Sort by price: low to high", sortBy: "basePrice", sortOrder: "asc" },
  price_desc: { label: "Sort by price: high to low", sortBy: "basePrice", sortOrder: "desc" },
  newest: { label: "Sort by newest", sortBy: "createdAt", sortOrder: "desc" },
};

function deriveSortValue(
  sortBy: string | null,
  sortOrder: string | null,
): SortValue {
  if (sortBy === "basePrice" && sortOrder === "asc") return "price_asc";
  if (sortBy === "basePrice" && sortOrder === "desc") return "price_desc";
  return "newest";
}

export default function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const current = deriveSortValue(
    searchParams.get("sortBy"),
    searchParams.get("sortOrder"),
  );

  const handleChange = (value: SortValue) => {
    const { sortBy, sortOrder } = SORT_OPTIONS[value];
    const params = new URLSearchParams(searchParams.toString());
    params.set("sortBy", sortBy);
    params.set("sortOrder", sortOrder);
    params.set("page", "1");
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <Select value={current} onValueChange={(v) => handleChange(v as SortValue)}>
      <SelectTrigger className="w-55 bg-white border-slate-200">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(SORT_OPTIONS) as SortValue[]).map((key) => (
          <SelectItem key={key} value={key}>
            {SORT_OPTIONS[key].label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
