import type {  ComponentProps, ReactNode } from "react";
import { cn } from "@/shared/lib/util";
import React from "react";

type Props = {
  label: string;
  icon: ReactNode;
} & ComponentProps<"div">;

export default function IconWithText({
  label,
  icon,
  className,
  ...props
}: Props) {
    // 💡 icon が有効なReact要素（単一のタグやコンポーネント）である場合、強制的にクラスを注入する
  const renderedIcon = React.isValidElement(icon)
    ? React.cloneElement(icon as React.ReactElement<any>, {
        className: cn((icon.props as any)?.className, "size-full"), // 元のクラスも維持しつつ、size-full を強制
      })
    : icon;

  return (
    <div
      className={cn(
        "inline-flex w-fit shrink-0 items-center whitespace-nowrap rounded-sm transition-colors",
        "h-fit gap-1 pl-1 pr-2 py-1 text-sm font-medium leading-none",
        "bg-transparent text-connecto-muted",
        className,
      )}
      {...props}
    >
      <span
        className="flex size-4 items-center justify-center "
        aria-hidden="true"
      >
        {renderedIcon}
      </span>
      <span>{label}</span>
    </div>
  );
}
