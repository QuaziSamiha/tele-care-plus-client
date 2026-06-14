"use client";

import { FiMinus, FiPlus } from "react-icons/fi";

export interface IQuantityCounter {
  maxValue?: number;
  minValue?: number;
  value: number;
  valueChange: (newValue: number) => void;
}

export default function QuantityCounter({
  maxValue,
  minValue = 1, // Usually starts at 1 for products
  value,
  valueChange,
}: IQuantityCounter) {
  const handleIncrement = () => {
    if (maxValue === undefined || value < maxValue) {
      valueChange(value + 1);
    }
  };

  const handleDecrement = () => {
    if (value > minValue) {
      valueChange(value - 1);
    }
  };

  return (
    <div className="flex items-center border border-slate-200 h-12">
      <button
        type="button"
        onClick={handleDecrement}
        className="px-4 text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-30 cursor-pointer"
        disabled={value <= minValue}
      >
        <FiMinus />
      </button>
      <div className="w-10 text-center font-medium text-slate-800">{value}</div>
      <button
        type="button"
        onClick={handleIncrement}
        className="px-4 text-slate-500 hover:text-slate-800 transition-colors disabled:opacity-30 cursor-pointer"
        disabled={maxValue !== undefined && value >= maxValue}
      >
        <FiPlus />
      </button>
    </div>
  );
}
// export interface IQuantityCounter {
//   maxValue?: number;
//   minValue?: number;
//   value: number;
//   valueChange: (newValue: number) => void;
// }
// export default function QuantityCounter({
//   maxValue,
//   minValue = 0,
//   value,
//   valueChange,
// }: IQuantityCounter) {
//   const handleIncrement = () => {
//     if (maxValue === undefined || value < maxValue) {
//       valueChange(value + 1);
//     }
//   };

//   const handleDecrement = () => {
//     if (minValue < value) {
//       valueChange(value - 1);
//     }
//   };

//   return (
//     <div className="flex items-center gap-6 border border-primary-500 rounded text-neutralPrimary-800 font-semibold ">
//       <button
//         type="button"
//         onClick={handleDecrement}
//         className="px-4 py-2 cursor-pointer text-xl hover:bg-mauve-700 hover:text-white border-r border-primary-500"
//       >
//         -
//       </button>
//       <div className="max-md:text-sm text-base flex items-center justify-center w-3">
//         {value}
//       </div>
//       <button
//         type="button"
//         onClick={handleIncrement}
//         className="px-4 py-2 cursor-pointer text-xl hover:bg-mauve-700 hover:text-white border-l border-primary-500"
//       >
//         +
//       </button>
//     </div>
//   );
// }
