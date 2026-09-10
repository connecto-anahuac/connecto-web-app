"use client";

import type { ReactNode } from "react";
import { DataTable } from "@/shared/component/composite/table/DataTable";
import DataSection from "@/shared/component/composite/datasection/DataSection";
import { useTable } from "@/shared/component/composite/table/hooks/useTable";
import { DataSearchProvider } from "@/shared/store/filter/FilterProvider";
import { useDataSearchActions, useDataSearchQuery } from "@/shared/store/filter/useFilterStore";
import type { DataViewConfig } from "@/shared/types/dataView.types";

type Props<TItem> = {
  data: readonly TItem[];
  config: DataViewConfig<TItem>;
  getRowId: (item: TItem) => string;
  scopeId: string;
  emptyMessage: string;
};

export function ProfessorDataSection<TItem>(props: Props<TItem>) {
  return <DataSearchProvider scopeId={props.scopeId}><Content {...props} /></DataSearchProvider>;
}

function Content<TItem>({ data, config, getRowId, emptyMessage }: Props<TItem>) {
  const query = useDataSearchQuery();
  const { setConditions, setSearchText } = useDataSearchActions();
  const { globalFilter, metadata, setGlobalFilter, table } = useTable({ config, data, getRowId, query, setConditions, setSearchText });
  const diagram: ReactNode = data.length === 0 ? <p>{emptyMessage}</p> : <DataTable config={config} table={table} />;
  return <DataSection className="h-full w-full" searchText={globalFilter} onSearchTextChange={setGlobalFilter} table={table} tableConfig={config} metadata={metadata} listDiagram={diagram} cardDiagram={diagram} />;
}
