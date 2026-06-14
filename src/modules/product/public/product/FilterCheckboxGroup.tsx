import React from "react";

interface FilterItem {
  id: number;
  name: string;
  parentId?: number;
}

interface Props {
  title: string;
  items: FilterItem[];
  selectedIds: number[];
  onChange: (ids: number[]) => void;
  disabledPredicate?: (item: FilterItem) => boolean;
}

export default function FilterCheckboxGroup({
  title,
  items,
  selectedIds,
  onChange,
  disabledPredicate,
}: Props) {
  const handleToggle = (id: number, checked: boolean) => {
    const nextIds = checked
      ? [...selectedIds, id]
      : selectedIds.filter((prevId) => prevId !== id);
    onChange(nextIds);
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-lg text-neutralPrimary-800 font-semibold">{title}</p>
      <div className="flex flex-col gap-3">
        {items.map((item) => {
          const isDisabled = disabledPredicate?.(item);
          return (
            <label
              key={item.id}
              className={`flex items-center gap-3 cursor-pointer ${isDisabled ? "opacity-50" : ""}`}
            >
              <input
                type="checkbox"
                checked={selectedIds.includes(item.id)}
                disabled={isDisabled}
                onChange={(e) => handleToggle(item.id, e.target.checked)}
                className="w-4 h-4 text-primary-600 rounded cursor-pointer"
              />
              <span className="text-sm text-neutralPrimary-800 font-medium">
                {item.name}
              </span>
            </label>
          );
        })}
      </div>
    </div>
  );
}
