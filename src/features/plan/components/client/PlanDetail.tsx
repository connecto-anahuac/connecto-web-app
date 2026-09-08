"use client";

import { useLiveQuery } from "dexie-react-hooks";
import CommonProfileSummary from "@/shared/component/composite/profileSummary/summary/CommonProfileSummary";
import DataSection from "@/shared/component/composite/datasection/DataSection";
import { DataTable } from "@/shared/component/composite/table/DataTable";
import { useTable } from "@/shared/component/composite/table/hooks/useTable";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import { fetchStudyPlanDetail } from "@/external/handler/study-plans/query.client";
import { DataSearchScopeProvider } from "@/shared/store/filter/FilterProvider";
import {
  useDataSearchActions,
  useDataSearchQuery,
} from "@/shared/store/filter/useFilterStore";
import { cn } from "@/shared/lib/util";
import { PlanCourseDiagram } from "./PlanCourseDiagram";
import { PLAN_COURSE_CONFIG } from "./planViewConfig";
import { GetItemId } from "@/shared/service/dataPipeline/filterDefinition";
import { StudyPlanCourseDto } from "@/external/dto/study-plan/study-plan.dto";

export function PlanDetail({
  planId,
  className,
}: {
  planId: string;
  className?: string;
}) {
  return (
    <DataSearchScopeProvider scopeId={`plans:courses:${planId}`}>
      <PlanDetailContent planId={planId} className={className} />
    </DataSearchScopeProvider>
  );
}


const getStudentGradeRowId: GetItemId<StudyPlanCourseDto> = (row) => row.id;
function PlanDetailContent({
  planId,
  className,
}: {
  planId: string;
  className?: string;
}) {
  const snapshot = useLiveQuery(async () => {
    try {
      return { data: await fetchStudyPlanDetail(planId) } as const;
    } catch (error) {
      console.error("Failed loading study plan", error);
      return { error: true } as const;
    }
  }, [planId]);
  const query = useDataSearchQuery();
  const { setConditions, setSearchText } = useDataSearchActions();
  const courses =
    snapshot && "data" in snapshot ? (snapshot.data?.courses ?? []) : [];
  const { filterResult, globalFilter, metadata, setGlobalFilter, table } =
    useTable({
      config: PLAN_COURSE_CONFIG,
      data: courses,
      getRowId: getStudentGradeRowId,
      query,
      setConditions,
      setSearchText,
    });

  if (!snapshot) return <div role="status">Cargando plan de estudios...</div>;
  if ("error" in snapshot)
    return <div role="alert">No se pudo cargar el plan de estudios.</div>;
  if (!snapshot.data)
    return <div role="alert">No se encontró el plan de estudios.</div>;
  const plan = snapshot.data;
  return (
    <div className={cn("flex h-full w-full flex-col gap-3", className)}>
      <ContentTitleSection title="Plan de estudios" />
      <div className="flex min-h-0 flex-1 gap-4">
        <CommonProfileSummary
          className="w-48 shrink-0"
          name={plan.name}
          information={[
            { iconName: "hashmark", label: "ID", value: plan.id },
            {
              iconName: "schedule",
              label: "Primer periodo",
              value: plan.firstPeriod || "--",
            },
            {
              iconName: "admin",
              label: "Administrador",
              value: plan.admin || "--",
            },
          ]}
        />
        <DataSection
          className="min-w-0 flex-1"
          searchText={globalFilter}
          onSearchTextChange={setGlobalFilter}
          table={table}
          tableConfig={PLAN_COURSE_CONFIG}
          metadata={metadata}
          listDiagram={
            courses.length ? (
              <DataTable config={PLAN_COURSE_CONFIG} table={table} />
            ) : (
              <div>No hay materias en este plan.</div>
            )
          }
          cardDiagram={
            courses.length ? (
              <PlanCourseDiagram
                courses={courses}
                filterResult={filterResult}
              />
            ) : (
              <div>No hay materias en este plan.</div>
            )
          }
        />
      </div>
    </div>
  );
}
