import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";
import CloseIcon from "./icon/CloseIcon";

type Props = ComponentProps<"button"> & {};

export default function InsideCircleCloseButton({
  className,
  onClick,
  ...props
}: Props) {
  return (
    <button
      className={cn(
          "size-4 rounded-full  cursor-pointer bg-gray-400/50 text-white p-0.5",
          "hover:bg-gray-400/70 ",
        className,
      )}
      onClick={onClick}
      {...props}
    >
      <CloseIcon className="w-full h-full aspect-square" />
    </button>
  );
}
