"use client";

import { useState } from "react";
import IconButtonOLD from "../button/IconButton2";
import ToggleButton from "../button/ToggleButton";
import SearchPresetChip from "../chip/SearchPresetChip";
import SearchBar from "../search/SearchBar";
import { cn } from "@/shared/lib/util";
import IconButton from "../button/IconButton";
import Button from "../button/Button";

type SearchTool = "sort" | "filter" | "pivot" | "hide";
export default function DataSection({
  children,
  onListClick,
  onCardViewClick,
  onViewChange,
  listTools = ["sort", "filter", "pivot", "hide"],
  cardviewTools = ["filter", "hide"],
}: {
  listTools?: SearchTool[];
  cardviewTools?: SearchTool[];
  children?: React.ReactNode;
  onListClick?: () => void;
  onCardViewClick?: () => void;
  onViewChange?: (view: "list" | "card") => void;
}) {
  const [selectedView, setSelectedView] = useState<"list" | "card">("list");
  const viewChangeHandler = (view: "list" | "card") => {
    setSelectedView(view);
    onViewChange?.(view);
  };

  const isEnable = (searchTool: SearchTool) => {
    if (selectedView === "list") {
      return listTools.includes(searchTool);
    }
    return cardviewTools.includes(searchTool);
  };
  return (
    <div className="flex flex-col gap-3">
      {/* 1 line */}
      <div className="flex gap-4 w-full">
        <SearchBar className="w-64" />

        <div className="flex gap-1.5 flex-1">
          {/* <ToggleButton label={"Filter"} icon="filter" />
          <ToggleButton label={"Filter"} icon="plus" /> */}

          <Button
            icon="filter"
            label="Filter"
            intent="darkInk"
            appearance="text"
            size="md"
          />
          <Button
            icon="plus"
            label="Add"
            intent="darkInk"
            appearance="text"
            size="md"
          />
        </div>
        <IconButton
          icon="zoomOut"
          intent="lightInk"
          appearance="filled"
          size="md"
        />
        {/* <IconButtonOLD icon="zoomOut" className="size-6.5" /> */}
      </div>

      {/* 2 line */}
      {/* when changed the chip size, still keep the height */}
      <div className="flex gap-3 items-center h-5">
        <SearchPresetChip>Ambiental</SearchPresetChip>
        <SearchPresetChip>Civil</SearchPresetChip>
        <SearchPresetChip>Industrial</SearchPresetChip>
        <SearchPresetChip>TIND</SearchPresetChip>
      </div>

      {/* 3 line */}

      <div className="flex gap-4 items-center">
        <GraphSwitcher
          onListClick={onListClick}
          onCardViewClick={onCardViewClick}
          onViewChange={viewChangeHandler}
        />

        <Button
          icon="sort"
          label="Sort"
          intent="darkInk"
          appearance="text"
          size="md"
          disabled={!isEnable("sort")}
        />

        <Button
          icon="unvisible"
          label="Ocultar"
          intent="darkInk"
          appearance="text"
          size="md"
          disabled={!isEnable("hide")}
        />

        <Button
          icon="pin"
          label="Pivot"
          intent="darkInk"
          appearance="text"
          size="md"
          disabled={!isEnable("pivot")}
        />

        {/* <ToggleButton label={"Sort"} icon="sort" isEnabled={isEnable("sort")} />
        <ToggleButton
          label={"Ocultar"}
          icon="unvisible"
          isEnabled={isEnable("hide")}
        />
        <ToggleButton
          label={"Pivot"}
          icon="pin"
          isEnabled={isEnable("pivot")}
        /> */}
      </div>

      {/* graph */}
      <div className="w-full h-full">
        {selectedView === "list" ? "LIST VIEW" : "CARD VIEW"}
      </div>
    </div>
  );
}

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
