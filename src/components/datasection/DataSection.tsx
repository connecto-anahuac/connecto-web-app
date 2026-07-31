"use client";

import { ComponentProps, useState } from "react";
import type { Table } from "@tanstack/react-table";
import SearchPresetChip from "../chip/SearchPresetChip";
import SearchBar from "../../features/search/components/searchbar/SearchBar";
import { cn } from "@/shared/lib/util";
import IconButton from "../button/IconButton";
import Button from "../button/Button";
import { FilterDefinition } from "@/features/search/shared/filterDefinition";
import type { FilterPreset } from "@/features/search/shared/filterPreset.type";
import type { DataViewConfig } from "@/components/table/dataView.types";
// import { TableFilterButtonGroup } from "@/components/table/DataTable";
import SortCard from "@/components/SortCard";
import ButtonModal from "../ButtonModal";
import { TanstackFilterButtonGroup } from "../button/TanstackFilterButtonGroup";
import { GraphSwitcher } from "./GraphSwitcher";
import { SearchTool } from "./buttonmodal/type";
import HideButtonModal from "./buttonmodal/HideButtonModal";
import PivotButtonModal from "./buttonmodal/PivotButtonModal";
import FilterButtonGroup from "../button/FilterButtonGroup";

type Props<TItem> = ComponentProps<"div"> & {
  definitions?: readonly FilterDefinition<TItem>[];
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
  table?: Table<TItem>;
  tableConfig?: DataViewConfig<TItem>;
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
  searchText,
  onSearchTextChange,
  table,
  tableConfig,
}: Props<TItem>) {
  const [selectedView, setSelectedView] = useState<"list" | "card">(
    defaultView,
  );
  const [openedTool, setOpenedTool] = useState<SearchTool | null>(null);
  const [draggedSortId, setDraggedSortId] = useState<string | null>(null);

  // const registros = useFilterStoreProvider((state) => state.registros);
  const viewChangeHandler = (view: "list" | "card") => {
    setSelectedView(view);
    onViewChange?.(view);
  };

  const isToolEnable = (searchTool: SearchTool) => {
    if (selectedView === "list") {
      return listTools.includes(searchTool);
    }
    return cardviewTools.includes(searchTool);
  };

  const moveSort = (fromId: string, toId: string) => {
    if (!table || fromId === toId) return;
    const sorting = [...table.getState().sorting];
    const fromIndex = sorting.findIndex((sort) => sort.id === fromId);
    const toIndex = sorting.findIndex((sort) => sort.id === toId);
    if (fromIndex < 0 || toIndex < 0) return;
    const [moved] = sorting.splice(fromIndex, 1);
    sorting.splice(toIndex, 0, moved!);
    table.setSorting(sorting);
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {/* 1st line */}
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
          <div className="w-4/5 shrink-0" />
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

      {/* 2nd line */}
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

        {table && tableConfig ? (
          // aaaaaaaaa
          <>
            {/* <FilterButtonGroup 
              config={tableConfig} /> */}
            <TanstackFilterButtonGroup
              className="flex-1 h-fit"
              config={tableConfig}
              table={table}
            />
          </>
        ) : (
          <div>Filter button group. table couldn&apos;t have</div>
          // <FilterButtonGroup definitions={definitions} className="flex-1 h-fit" />
        )}
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

      {/* 3rd line */}

      <div className="flex gap-4 items-end">
        <GraphSwitcher
          onListClick={onListClick}
          onCardViewClick={onCardViewClick}
          onViewChange={viewChangeHandler}
        />
        {/* //TODO switch切り替え時のフィルター変更処理  */}

        {/* sort */}
        <ButtonModal
          open={
            openedTool === "sort" &&
            table !== undefined &&
            tableConfig !== undefined
          }
          onOpenChange={() =>
            setOpenedTool((tool) => (tool === "sort" ? null : "sort"))
          }
        >
          <ButtonModal.Trigger>
            <Button
              icon="sort"
              label="Sort"
              intent="darkInk"
              appearance="text"
              size="md"
              disabled={!isToolEnable("sort")}
              hasBadge={
                table?.getState().sorting.length !== undefined &&
                table?.getState().sorting.length > 0
              }
              // onClick={() => setOpenedTool((tool) => tool === "sort" ? null : "sort")}
            />
          </ButtonModal.Trigger>
          <ButtonModal.Content>
            <div className=" flex min-w-72 w-fit flex-col gap-2 rounded-md border border-Outline bg-InverseSurface p-2 text-InverseOnSurface shadow-lg">
              {table!.getState().sorting.map((sort) => {
                const config = tableConfig!.columns.find(
                  (column) => column.id === sort.id,
                );
                if (!config) return null;
                return (
                  <SortCard
                    descending={sort.desc}
                    draggable
                    fieldLabel={config.label}
                    key={sort.id}
                    onDirectionToggle={() =>
                      table!.setSorting((current) =>
                        current.map((item) =>
                          item.id === sort.id
                            ? { ...item, desc: !item.desc }
                            : item,
                        ),
                      )
                    }
                    onDragOver={(event) => event.preventDefault()}
                    onDragStart={() => setDraggedSortId(sort.id)}
                    onDrop={() => {
                      if (draggedSortId) moveSort(draggedSortId, sort.id);
                      setDraggedSortId(null);
                    }}
                    onRemove={() =>
                      table!.setSorting((current) =>
                        current.filter((item) => item.id !== sort.id),
                      )
                    }
                  />
                );
              })}
              <div className="border-t border-Outline pt-1">
                {tableConfig!.columns
                  .filter(
                    (column) =>
                      !table!
                        .getState()
                        .sorting.some((sort) => sort.id === column.id),
                  )
                  .map((column) => (
                    <button
                      className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-Primary hover:text-OnPrimary"
                      key={column.id}
                      onClick={() =>
                        table!.setSorting((current) => [
                          ...current,
                          { id: column.id, desc: false },
                        ])
                      }
                      type="button"
                    >
                      <span className="text-base">+</span>
                      {column.label}
                    </button>
                  ))}
              </div>
            </div>
          </ButtonModal.Content>
        </ButtonModal>

        <HideButtonModal
          open={
            openedTool === "hide" &&
            table !== undefined &&
            tableConfig !== undefined
          }
          onOpenChange={() =>
            setOpenedTool((tool) => (tool === "hide" ? null : "hide"))
          }
          disabled={!isToolEnable("hide")}
          table={table}
          tableConfig={tableConfig}
          hasBadge={table
            ?.getAllLeafColumns()
            .some((column) => !column.getIsVisible())}
        />

        <PivotButtonModal
          open={
            openedTool === "pivot" &&
            table !== undefined &&
            tableConfig !== undefined
          }
          onOpenChange={() =>
            setOpenedTool((tool) => (tool === "pivot" ? null : "pivot"))
          }
          disabled={!isToolEnable("pivot")}
          table={table}
          tableConfig={tableConfig}
          hasBadge={
            table?.getState().columnPinning?.left?.length !== undefined &&
            table?.getState().columnPinning?.left?.length! > 0
          }
        />

        <span className="ml-auto   text-xs font-medium">
          {table ? table.getFilteredRowModel().rows.length : "--"} registros
        </span>
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
