import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "radix-ui/tooltip";

type Props = {
  children: React.ReactNode;
  hint: string;
  disabled?: boolean;
  side?: "bottom" | "top" | "right" | "left";
  align?: "center" | "start" | "end";
};

export default function ToolTipWrapper({ children, hint, disabled=false,side="bottom",align="start" }: Props) {
    if (disabled) {
    return children;
  }
  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          side={side}
          align={align}
          sideOffset={6}
          collisionPadding={8}
          avoidCollisions
          className="
            z-50
            rounded-sm
            px-2
            py-1
            text-xs
            text-InverseOnSurface
            bg-InverseSurface
            
            shadow
          "
        >
          {hint}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
