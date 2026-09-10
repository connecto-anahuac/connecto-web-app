import { cn } from "@/shared/lib/util";
import { ComponentProps } from "react";
import Button from "./button/Button";
import IconButton from "./button/IconButton";

type Props = ComponentProps<"div"> & {
  title: string;
};

export default function ContentTitleSection({
  title,
  className,
  ...props
}: Props) {
  return (
    <div {...props} className={cn("flex flex-col gap-3 pb-5 w-full", className)}>
      <div className=" flex items-center w-full">
        <h2 className="text-sm font-semibold text-OnSurface">{title}</h2>
        <div className="flex items-center gap-3 ml-auto">
          <Button
            size="sm"
            intent="primary"
            appearance="filled"
            label="Editar"
            icon="edit"
          />
          <IconButton
            size="lg"
            intent="lightInk"
            appearance="text"
            icon="threePointMenu"
          />
        </div>
      </div>
        <div className="w-full h-px bg-DividerMiddle" />
    </div>
  );
}
