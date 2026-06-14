import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ICustomTooltip } from "@/types/share-component.type";
import { BiSolidEdit } from "react-icons/bi";
import { IoEyeOutline } from "react-icons/io5";
import { MdDelete } from "react-icons/md";

export default function CustomTooltipPrimary({ action, content }: ICustomTooltip) {
  return (
    <div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="cursor-pointer">
            {action === "edit" && (
              <BiSolidEdit fontSize={24} className="text-neutral-500" />
            )}
            {action === "view" && (
              <IoEyeOutline fontSize={20} className="text-neutral-500" />
            )}
            {action === "delete" && (
              <MdDelete
                fontSize={24}
                className="text-neutral-500 hover:text-destructive-600"
              />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
