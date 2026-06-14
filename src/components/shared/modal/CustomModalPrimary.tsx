import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { ICustomModalPrimary } from "@/types/share-component.type";

export default function CustomModalPrimary({
  open,
  onOpenChange,
  // footerButton,
  footerRequired,
  dialogHeight = "max-h-[80vh]",
  dialogWidth = "w-[60vw]",
  children,
}: ICustomModalPrimary) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <VisuallyHidden>
        <DialogTrigger asChild>
          <button>Hidden Button</button>
        </DialogTrigger>
      </VisuallyHidden>
      <DialogContent
        className={`${dialogWidth} ${dialogHeight} overflow-y-auto scroll-auto mt-8 overflow-x-hidden`}
      >
        <VisuallyHidden>
          <DialogTitle>Hidden title</DialogTitle>
        </VisuallyHidden>
        {children}
      </DialogContent>
      {footerRequired && (
        <DialogFooter className="flex items-end justify-end gap-4">
          <DialogClose asChild>
            <button
              type="button"
              className="border border-neutral-300 font-semibold text-base text-neutral-600 rounded cursor-pointer px-5 py-2.5"
            >
              Close
            </button>
          </DialogClose>
          {/* {footerButton} */}
        </DialogFooter>
      )}
    </Dialog>
  );
}
