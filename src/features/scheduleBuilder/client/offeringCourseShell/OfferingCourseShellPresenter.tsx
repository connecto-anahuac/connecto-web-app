import type { Table } from "@tanstack/react-table";
import ScheduleClassCard from "@/features/scheduleBuilder/component/ClassCard";
import type { ScheduleClassCardProps } from "@/features/scheduleBuilder/component/ClassCard";
import { cn } from "@/shared/lib/util";
import type { FilterPreset } from "@/shared/service/dataPipeline/filterPreset.type";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/types/dataView.types";
import HideButtonModal from "@/shared/component/composite/datasection/buttonmodal/HideButtonModal";
import PivotButtonModal from "@/shared/component/composite/datasection/buttonmodal/PivotButtonModal";
import { SearchTool } from "@/shared/component/composite/datasection/buttonmodal/type";
import { DataSectionFilterProvider } from "@/shared/component/composite/datasection/DataSectionFilterContext";
import { GraphSwitcher } from "@/shared/component/composite/datasection/GraphSwitcher";
import { DataTable } from "@/shared/component/composite/table/DataTable";
import Button from "@/shared/component/primitive/button/Button";
import FilterButtonGroup from "@/shared/component/primitive/button/FilterButtonGroup";
import IconButton from "@/shared/component/primitive/button/IconButton";
import ButtonModal from "@/shared/component/primitive/ButtonModal";
import SearchPresetChip from "@/shared/component/primitive/chip/SearchPresetChip";
import SearchBar from "@/shared/component/primitive/searchbar/SearchBar";
import SortCard from "@/shared/component/primitive/SortCard";
import { ComponentProps, type ReactElement, ReactNode, useState } from "react";
import type { ScheduleBuilderOfferingCourse } from "./scheduleBuilderOfferingCourse";
import ShellSection from "./ShellSection";
import Link from "next/link";

export type OfferingCourseShellPresenterProps = {
  className?: string;
  config: DataViewConfig<ScheduleBuilderOfferingCourse>;
  error: string | null;
  globalFilter: string;
  loading: boolean;
  metadata: DataViewMetadata;
  onGlobalFilterChange: (value: string) => void;
  presets: readonly FilterPreset[];
  table: Table<ScheduleBuilderOfferingCourse>;
  completedCourseKeys?: readonly string[];
  draggingCourseKey?: string | null;
  selectedCourseKey?: string | null;
  onCourseClick?: (courseKey: string) => void;
  renderCourseCard?: (
    course: ScheduleBuilderOfferingCourse,
    card: ReactElement<ScheduleClassCardProps>,
  ) => ReactNode;
};

export function OfferingCourseShellPresenter({
  className,
  config,
  error,
  globalFilter,
  loading,
  metadata,
  onGlobalFilterChange,
  presets,
  table,
  completedCourseKeys = [],
  draggingCourseKey = null,
  selectedCourseKey = null,
  onCourseClick,
  renderCourseCard,
}: OfferingCourseShellPresenterProps) {
  const rows = table.getRowModel().rows;
  const completed = new Set(completedCourseKeys);

  let listDiagram;
  if (loading) {
    listDiagram = (
      <p className="p-4 text-sm text-neutral-600">Loading offering courses…</p>
    );
  } else if (error) {
    listDiagram = (
      <p className="p-4 text-sm text-red-700" role="alert">
        {error}
      </p>
    );
  } else if (rows.length === 0) {
    listDiagram = (<div className="flex flex-col gap-1 items-center">
       <p className="p-4 text-sm text-neutral-600">No offering courses found.</p>
  <Link href="/schedule-builder/offering-course" className="w-full">
    <div className="py-1 w-full text-center  bg-Secondary text-OnSecondary text-base rounded-md hover:opacity-75"> ＞ Ofertar cursos</div>
  </Link>
    </div>
     );
  } else {
    listDiagram = (
      <div className="flex h-full min-h-0 flex-col gap-2 overflow-y-auto pr-1 scrollbar-none">
        {rows.map((row) => {
          const course = row.original;
          const isComplete = completed.has(course.key);
          const card = (
            <ScheduleClassCard
              className="w-full shrink-0 cursor-grab"
              courseCode={course.keyCode}
              courseNumber={course.keyNumber}
              hours={course.hours}
              key={row.id}
              classCount={course.hours/1.5}
              recommendedSemester={course.semester}
              title={course.name}
              totalStudents={course.estimatedNumber}
              completed={isComplete}
              disabled={isComplete}
              dragging={draggingCourseKey === course.key}
              selected={selectedCourseKey === course.key}
              onClick={() => onCourseClick?.(course.key)}
              type="shell"
              sessionNumber={1}
            />
          );
          return renderCourseCard
            ? renderCourseCard(course, card)
            : card;
        })}
      </div>
    );
  }

  return (
    <aside
      aria-label="Offering courses"
      className={cn(
        "flex w-60 min-w-0 flex-col border-r border-DividerMiddle p-2",
        className,
      )}
    >
      <ShellSection
        className="min-h-0 flex-1"
        defaultView="list"
        enableView={["list"]}
        listDiagram={listDiagram}
        listTools={["sort", "filter"]}
        metadata={metadata}
        onSearchTextChange={onGlobalFilterChange}
        presets={presets}
        searchText={globalFilter}
        showZoom={false}
        table={table}
        tableConfig={config}
      />
    </aside>
  );
}

