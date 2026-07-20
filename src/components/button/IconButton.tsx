import { ComponentProps } from "react";
import CloseIcon from "../icon/CloseIcon";
import { cn } from "@/shared/lib/util";
import { IconName, Icons } from "../icon";

type Props = ComponentProps<"button"> & {icon?: IconName;};
export default function IconButton({
  "aria-label": ariaLabel,
  className,
  icon,
  children,
  ...props
}: Props) {
  const IconComponent=icon && Icons[icon] ? Icons[icon] : null;
  return (
    <button
      type="button"
      aria-label={ariaLabel ?? `button`}
      className={cn(
        "inline-flex size-6 rounded-md aspect-square w-fit h-fit items-center justify-center rounded-sm p-1 transition-colors  hover:bg-OnSurfaceVariant/30",
        className,
      )}
      {...props}
    >
     {IconComponent && <IconComponent className="size-full" />}
    </button>
  );
}
