"use client";

import { ComponentProps, useState } from "react";
import IconButtonOLD from "../button/IconButton2";
import SearchPresetChip from "../chip/SearchPresetChip";
import SearchBar from "../../features/search/components/searchbar/SearchBar";
import { cn } from "@/shared/lib/util";
import IconButton from "../button/IconButton";
import Button from "../button/Button";
import { FilterDefinition } from "@/features/search/shared/filterDefinition";
import FilterButtonGroup from "../button/FilterButtonGroup";
import type { FilterPreset } from "@/features/search/shared/filterPreset.type";

type SearchTool = "sort" | "filter" | "pivot" | "hide";

type Props<TItem> = ComponentProps<"div"> & {
  definitions: readonly FilterDefinition<TItem>[];
  defaultView?: "list" | "card";
  listTools?: SearchTool[];
  cardviewTools?: SearchTool[];
  listDiagram?: React.ReactNode;
  cardDiagram?: React.ReactNode;
  onListClick?: () => void;
  onCardViewClick?: () => void;
  onViewChange?: (view: "list" | "card") => void;
  presets?: readonly FilterPreset[];
  searchText?: string;
  onSearchTextChange?: (value: string) => void;
};
export default function DataSection<TItem>({
  className,
  presets,
  onListClick,
  onCardViewClick,
  onViewChange,
  listTools = ["sort", "filter", "pivot", "hide"],
  cardviewTools = ["filter", "hide"],
  listDiagram,
  cardDiagram,
  defaultView = "list",
  definitions,
  searchText,
  onSearchTextChange,
}: Props<TItem>) {
  const [selectedView, setSelectedView] = useState<"list" | "card">(
    defaultView,
  );

  // const registros = useFilterStoreProvider((state) => state.registros);
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
    <div className={cn("flex flex-col gap-2", className)}>
      {/* 1 line */}
      <div className="flex gap-4 w-full items-center">
        <SearchBar
          className="w-64"
          value={searchText}
          onChange={(event) => onSearchTextChange?.(event.target.value)}
          onClear={() => onSearchTextChange?.("")}
        />

        {/* when changed the chip size, still keep the height */}
        <div className="flex flex-1 gap-3 items-center overflow-x-auto scrollbar-none">
          {presets?.map((preset, index) => (
            <SearchPresetChip
              key={`${preset.label}-${index}`}
              selected={preset.isSelected}
              onClick={preset.onToggle}
            >
              {preset.label}
            </SearchPresetChip>
          ))}

          {/* scroll margin */}
          <div className="w-4/5 shrink-0"/>
        </div>

        {/* //TODO zoom */}
        {/* <IconButton
          icon="zoomOut"
          intent="lightInk"
          appearance="filled"
          size="md"
          className="shrink-0"
        /> */}
        {/* <IconButtonOLD icon="zoomOut" className="size-6.5" /> */}
      </div>

      {/* 2 line */}
      <div className="flex gap-1.5 w-full min-w-0 h-fit">
        {/* //TODO filter button　追加tと機能 */}
        <Button
          icon="filter"
          label="Filter"
          intent="darkInk"
          appearance="text"
          size="md"
          className="shrink-0 hover:bg-transparent active:bg-transparent"
        />

        <FilterButtonGroup definitions={definitions} className="flex-1 h-fit" />

        
      </div>

      {/* <div className="flex gap-3 items-center h-5">
        {presets?.map((preset, index) => (
          <SearchPresetChip
            key={`${preset.label}-${index}`}
            selected={preset.isSelected}
            onClick={preset.onToggle}
          >
            {preset.label}
          </SearchPresetChip>
        ))}
      </div> */}

      {/* 3 line */}

      <div className="flex gap-4 items-end">
        <GraphSwitcher
          onListClick={onListClick}
          onCardViewClick={onCardViewClick}
          onViewChange={viewChangeHandler}
        />
        {/* //TODO switch切り替え時のフィルター変更処理  */}

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
        <span className="ml-auto   text-xs font-medium">{43} registros</span>
         {/* //TODO zoom */}
        <IconButton
          icon="zoomIn"
          intent="lightInk"
          appearance="text"
          size="md"
          className="shrink-0 "
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
      <div className="w-full flex-1 min-h-0">
        {selectedView === "list" ? listDiagram : cardDiagram}
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
