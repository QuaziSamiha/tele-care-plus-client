"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { Search, X, ArrowRight, Clock } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetPublishedProducts } from "@/modules/product/hooks/usePublicProduct";
import { IProduct, ProductType } from "@/modules/product/types/product.type";

const RECENT_KEY = "thp:recentSearches";
const RECENT_MAX = 5;
const DEBOUNCE_MS = 250;

interface IProps {
  isHome: boolean;
}

export default function SearchProductsDialog({ isHome }: IProps) {
  const t = useTranslations("Search");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [debounced, setDebounced] = useState("");
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    try {
      const raw = window.localStorage.getItem(RECENT_KEY);
      if (raw) setRecent(JSON.parse(raw) as string[]);
    } catch { }
  }, [open]);

  useEffect(() => {
    const id = window.setTimeout(() => setDebounced(value.trim()), DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [value]);

  const enabledQuery = debounced.length >= 2;
  const { data, isFetching } = useGetPublishedProducts({
    page: 1,
    limit: 6,
    search: enabledQuery ? debounced : undefined,
  });

  const results: IProduct[] = useMemo(() => {
    return enabledQuery ? (data?.data ?? []) : [];
  }, [enabledQuery, data]);

  const persistRecent = (q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const next = [trimmed, ...prev.filter((p) => p !== trimmed)].slice(
        0,
        RECENT_MAX,
      );
      try {
        window.localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch { }
      return next;
    });
  };

  const close = () => {
    setOpen(false);
    setValue("");
    setDebounced("");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (q) persistRecent(q);
    router.push(q ? `/product?search=${encodeURIComponent(q)}` : "/product");
    close();
  };

  const pickRecent = (q: string) => {
    setValue(q);
    setDebounced(q);
  };

  const clearRecent = () => {
    setRecent([]);
    try {
      window.localStorage.removeItem(RECENT_KEY);
    } catch { }
  };

  const onResultClick = (p: IProduct) => {
    persistRecent(value || debounced);
    close();
    const href =
      p.type === ProductType.COMBO
        ? `/combo-product-details/${p.slug}`
        : `/product-details/${p.slug}`;
    router.push(href);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          aria-label={t("title")}
          className={`cursor-pointer ${isHome ? "text-white" : "text-mauve-800"}`}
        >
          <Search className="w-6 h-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl p-0 overflow-hidden gap-0">
        <DialogHeader className="px-6 pt-6 pb-4 space-y-0">
          <DialogTitle className="text-lg font-semibold text-slate-900">
            {t("title")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={submit} className="px-6 pb-4">
          <div className="relative flex items-center h-11 rounded-lg border border-neutral-200 bg-white shadow-sm focus-within:border-primary-500 focus-within:ring-2 focus-within:ring-primary-500/20 transition-colors">
            <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={t("placeholder")}
              className="flex-1 h-full pl-10 pr-2 bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none"
            />
            {value && (
              <button
                type="button"
                aria-label={t("clear")}
                onClick={() => {
                  setValue("");
                  setDebounced("");
                }}
                className="text-slate-400 hover:text-slate-600 cursor-pointer px-2"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="submit"
              disabled={!value.trim()}
              className="m-1 h-9 px-4 bg-mauve-700 hover:bg-mauve-700 text-white text-sm font-medium rounded-md transition-colors cursor-pointer disabled:bg-neutral-200 disabled:text-slate-400 disabled:cursor-not-allowed disabled:hover:bg-neutral-200"
            >
              {t("button")}
            </button>
          </div>
        </form>

        <div className="border-t border-neutral-100 max-h-110 overflow-y-auto">
          {!enabledQuery ? (
            recent.length > 0 ? (
              <div className="px-6 py-5">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                    {t("recent")}
                  </p>
                  <button
                    type="button"
                    onClick={clearRecent}
                    className="text-xs text-primary-600 hover:text-primary-800 font-medium cursor-pointer"
                  >
                    {t("clear")}
                  </button>
                </div>
                <ul className="flex flex-col gap-0.5">
                  {recent.map((q) => (
                    <li key={q}>
                      <button
                        type="button"
                        onClick={() => pickRecent(q)}
                        className="w-full flex items-center gap-2.5 text-left text-sm text-slate-700 hover:bg-neutral-50 rounded-md px-2.5 py-2 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="line-clamp-1">{q}</span>
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="px-6 py-14 flex flex-col items-center gap-2 text-center">
                <div className="w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center">
                  <Search className="w-5 h-5 text-slate-400" />
                </div>
                <p className="text-sm text-slate-400">{t("placeholder")}</p>
              </div>
            )
          ) : isFetching ? (
            <ul className="flex flex-col">
              {Array.from({ length: 3 }).map((_, i) => (
                <li
                  key={i}
                  className="flex items-center gap-3 px-6 py-3 animate-pulse"
                >
                  <div className="w-14 h-14 bg-neutral-200 rounded-md shrink-0" />
                  <div className="flex-1 flex flex-col gap-2">
                    <div className="h-3.5 w-3/4 bg-neutral-200 rounded" />
                    <div className="h-3 w-1/3 bg-neutral-200 rounded" />
                  </div>
                </li>
              ))}
            </ul>
          ) : results.length === 0 ? (
            <div className="px-6 py-14 flex flex-col items-center gap-2 text-center">
              <div className="w-11 h-11 rounded-full bg-neutral-100 flex items-center justify-center">
                <Search className="w-5 h-5 text-slate-400" />
              </div>
              <p className="text-sm text-slate-500">
                {t("noResults", { query: debounced })}
              </p>
            </div>
          ) : (
            <>
              <ul className="flex flex-col py-1">
                {results.map((p) => (
                  <li key={`${p.type}-${p.id}`}>
                    <SearchResultRow
                      product={p}
                      onClick={() => onResultClick(p)}
                      comboLabel={t("comboBadge")}
                    />
                  </li>
                ))}
              </ul>
              <Link
                href={`/product?search=${encodeURIComponent(debounced)}`}
                onClick={() => {
                  persistRecent(debounced);
                  close();
                }}
                className="flex items-center justify-between gap-2 border-t border-neutral-100 px-6 py-3.5 text-sm font-medium text-mauve-800 hover:bg-primary-50 transition-colors"
              >
                <span className="line-clamp-1">
                  {t("viewAll", { query: debounced })}
                </span>
                <ArrowRight className="w-4 h-4 shrink-0" />
              </Link>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function SearchResultRow({
  product,
  onClick,
  comboLabel,
}: {
  product: IProduct;
  onClick: () => void;
  comboLabel: string;
}) {
  const primaryImage =
    product.images?.find((img) => img.isPrimary) ?? product.images?.[0];
  const imageUrl = primaryImage?.url ?? "/images/home/product-placeholder.png";

  const defaultVariant =
    product.variants?.find((v) => v.isDefault) ?? product.variants?.[0];
  const basePrice = Number(defaultVariant?.price ?? product.basePrice ?? 0);
  const salePrice =
    defaultVariant?.salePrice != null
      ? Number(defaultVariant.salePrice)
      : product.salePrice != null
        ? Number(product.salePrice)
        : undefined;
  const showSale =
    typeof salePrice === "number" && salePrice > 0 && salePrice < basePrice;
  const isCombo = product.type === ProductType.COMBO;

  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full flex items-center gap-3.5 px-6 py-2.5 text-left hover:bg-neutral-50 transition-colors cursor-pointer"
    >
      <div className="relative w-14 h-14 shrink-0 bg-neutral-100 rounded-md overflow-hidden border border-neutral-200/60">
        <Image
          src={imageUrl}
          fill
          alt={product.name}
          sizes="56px"
          className="object-contain p-1.5"
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col gap-0.5">
        <div className="flex items-center gap-2 min-w-0">
          {isCombo && (
            <span className="bg-amber-500 text-white px-1.5 py-0.5 text-[10px] font-bold tracking-wide rounded shrink-0">
              {comboLabel}
            </span>
          )}
          <p className="line-clamp-1 text-sm font-medium text-slate-800">
            {product.name}
          </p>
        </div>
        <div className="flex items-baseline gap-2">
          {showSale ? (
            <>
              <span className="text-sm font-semibold text-slate-900">
                ฿{salePrice!.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 line-through">
                ฿{basePrice.toFixed(2)}
              </span>
            </>
          ) : (
            <span className="text-sm font-semibold text-slate-900">
              ฿{basePrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
      <ArrowRight className="w-4 h-4 text-slate-300 shrink-0" />
    </button>
  );
}
