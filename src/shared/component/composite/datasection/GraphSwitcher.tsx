import { cn } from "@/shared/lib/util";
import IconButtonOLD from "../../primitive/button/IconButton2";
import { useState } from "react";
import ToolTipWrapper from "../../primitive/ToolTipWrapper";

export function GraphSwitcher({
  selectedView,
  onListClick,
  onCardViewClick,
  onViewChange,
  isEnabled = ["list", "card"],
}: {
  selectedView?: "list" | "card";
  isEnabled?: ("list" | "card")[];
  onListClick?: () => void;
  onCardViewClick?: () => void;
  onViewChange?: (view: "list" | "card") => void;
}) {
  const [uncontrolledSelectedView, setUncontrolledSelectedView] = useState<
    "list" | "card"
  >("list");
  const currentSelectedView = selectedView ?? uncontrolledSelectedView;
  const unselectedStyle =
    "bg-transparent text-OnSurface/60 hover:bg-OnSurface/10";
  const selectedStyle = "bg-OnSurface/60 text-white hover:bg-OnSurface/60";

  const handleClick = (view: "list" | "card") => {
    if (selectedView === undefined) {
      setUncontrolledSelectedView(view);
    }
    onViewChange?.(view);

    if (view === "list") {
      onListClick?.();
      return;
    }

    onCardViewClick?.();
  };

  return (
    <div className="flex gap-0 rounded-md bg-DividerMiddle p-0.5">
      {/* <IconButton
          icon="list"
          intent="lightInk"
          appearance="filled"
        size="md"
        onClick={() => handleClick("list")}
        
      />
      
        <IconButton
          icon="cardView"
          intent="lightInk"
          appearance="filled"
          size="md"
          onClick={() => handleClick("card")}
        /> */}

      <ToolTipWrapper hint="Vista de lista">
        <IconButtonOLD
          aria-label="List view"
          aria-pressed={currentSelectedView === "list"}
          icon="list"
          className={cn(
            "rounded-md size-6",
            currentSelectedView === "list" ? selectedStyle : unselectedStyle,
            !isEnabled?.includes("list") && "opacity-50 cursor-not-allowed",
          )}
          onClick={() => handleClick("list")}
        />
      </ToolTipWrapper>
      <ToolTipWrapper hint="Vista de diagrama">
        <IconButtonOLD
          aria-label="Card view"
          aria-pressed={currentSelectedView === "card"}
          icon="cardView"
          className={cn(
            "rounded-md size-6",
            currentSelectedView === "card" ? selectedStyle : unselectedStyle,
            !isEnabled?.includes("card") && "opacity-50 cursor-not-allowed",
          )}
          onClick={() => handleClick("card")}
        />
      </ToolTipWrapper>
    </div>
  );
}
