import { IAddButton } from "@/types/share-component.type";
import { MdAdd } from "react-icons/md";

export default function AddButton({ label, setOpen }: IAddButton) {
  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className="flex items-center justify-center gap-2 bg-mauve-800 hover:bg-mauve-600 text-white font-semibold text-base rounded w-fit px-14 py-3 cursor-pointer"
    >
      <MdAdd className="text-white w-6 h-6" />
      {label}
    </button>
  );
}
