import { cn } from "@/shared/lib/util";
import IconButtonOLD from "../button/IconButton2";
import { useState } from "react";

export 
function GraphSwitcher({
  onListClick,
  onCardViewClick,
  onViewChange,
}: {
  onListClick?: () => void;
  onCardViewClick?: () => void;
  onViewChange?: (view: "list" | "card") => void;
}) {
  const [selectedView, setSelectedView] = useState<"list" | "card">("list");
  const unselectedStyle =
    "bg-transparent text-OnSurface/60 hover:bg-OnSurface/10";
  const selectedStyle = "bg-OnSurface/60 text-white hover:bg-OnSurface/60";

  const handleClick = (view: "list" | "card") => {
    setSelectedView(view);
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

      <IconButtonOLD
        icon="list"
        className={cn(
          "rounded-md size-6",
          selectedView === "list" ? selectedStyle : unselectedStyle,
        )}
        onClick={() => handleClick("list")}
      />
      <IconButtonOLD
        icon="cardView"
        className={cn(
          "rounded-md size-6",
          selectedView === "card" ? selectedStyle : unselectedStyle,
        )}
        onClick={() => handleClick("card")}
      />
    </div>
  );
}
