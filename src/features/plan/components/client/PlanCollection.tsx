"use client";

import { useLiveQuery } from "dexie-react-hooks";
import { fetchStudyPlanCollection } from "@/external/handler/study-plans/query.client";
import { useTable } from "@/shared/component/composite/table/hooks/useTable";
import { useDataSearchActions, useDataSearchQuery } from "@/shared/store/filter/useFilterStore";
import { PlanCollectionPresenter } from "./PlanCollectionPresenter";
import { PlanDetail } from "./PlanDetail";
import { PLAN_COLLECTION_CONFIG } from "./planViewConfig";
import { usePlanPreviewNavigation } from "./usePlanPreviewNavigation";
import type { GetItemId } from "@/shared/service/dataPipeline/filterDefinition";
import type { StudyPlanCollectionDto } from "@/external/dto/study-plan/study-plan.dto";

const getStudentGradeRowId: GetItemId<StudyPlanCollectionDto> = (row) => row.id;
export function PlanCollection({ activeId }: { activeId?: string }) {
  const snapshot = useLiveQuery(async () => {
    try { return { data: await fetchStudyPlanCollection() } as const; }
    catch (error) { console.error("Failed loading study plans", error); return { error: true } as const; }
  }, []);
  const query = useDataSearchQuery();
  const { setConditions, setSearchText } = useDataSearchActions();
  const data = snapshot && "data" in snapshot ? snapshot.data ?? [] : [];
  const { globalFilter, metadata, setGlobalFilter, table } = useTable({
    config: PLAN_COLLECTION_CONFIG,
    data,
    getRowId: getStudentGradeRowId,
    query,
    setConditions,
    setSearchText,
  });
  const navigation = usePlanPreviewNavigation();
  return <PlanCollectionPresenter
    activeId={activeId} config={PLAN_COLLECTION_CONFIG} data={data} error={Boolean(snapshot && "error" in snapshot)} loading={!snapshot}
    metadata={metadata} onSearchTextChange={setGlobalFilter} searchText={globalFilter}
    onClose={navigation.closePlanPreview} onOpen={navigation.openPlanDetail} onSelect={navigation.selectPlan}
    renderPreview={(id) => <PlanDetail className="px-4" planId={id} />} table={table}
  />;
}
