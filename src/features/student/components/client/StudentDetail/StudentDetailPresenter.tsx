import type { StudentClassItem } from "@/features/student/types";
import * as Tabs from "@radix-ui/react-tabs";
import ContentTitleSection from "@/shared/component/primitive/ContentTitleSection";
import DataSection from "@/shared/component/composite/datasection/DataSection";
import { StudentDiagram } from "./StudentDiagram";
import type { FilterPreset } from "@/shared/service/dataPipeline/filterPreset.type";
import type { Table } from "@tanstack/react-table";
import type {
  DataViewConfig,
  DataViewMetadata,
} from "@/shared/types/dataView.types";
import { DataTable } from "@/shared/component/composite/table/DataTable";
import type { FilterResult } from "@/shared/service/dataPipeline/filterDefinition";
import ProfileSummary, {
  type Informations,
} from "@/shared/component/composite/profileSummary/summary/ProfileSummary";
import type { StudentStatus } from "@/shared/types/consts";
import type { ProfileDataCardProps } from "@/shared/component/composite/profileSummary/card/ProfileDataCard";
import TabBadge from "@/shared/component/primitive/TabBadge";
import { Icons } from "@/shared/component/primitive/icon";
import { StudentOverview } from "./StudentOverview";
import type { StudentDetailTab } from "./useStudentDetailTabs";

export type StudentDetailPresenterProps = {
  studentGrades: readonly StudentClassItem[];
  table: Table<StudentClassItem>;
  tableConfig: DataViewConfig<StudentClassItem>;
  searchText: string;
  onSearchTextChange: (value: string) => void;
  presets: readonly FilterPreset[];
  filterResult: FilterResult;
  metadata: DataViewMetadata;
  profileInformations: Informations;
  imgSrc: string;
  status: StudentStatus;
  planTotalSemesters: number;
  topLeftInformations: ProfileDataCardProps[];
  warningInformations: ProfileDataCardProps;
  requirementInformations: ProfileDataCardProps;
  failedClassInformations: ProfileDataCardProps;
  selectedTab: StudentDetailTab;
  onTabChange: (value: string) => void;
};

export function StudentDetailPresenter({
  studentGrades,
  table,
  tableConfig,
  searchText,
  onSearchTextChange,
  presets,
  filterResult,
  metadata,
  profileInformations,
  imgSrc,
  status,
  planTotalSemesters,
  topLeftInformations,
  warningInformations,
  requirementInformations,
  failedClassInformations,
  selectedTab,
  onTabChange,
}: StudentDetailPresenterProps) {
  return (
    <div className="flex flex-col gap-3 pb-0 w-full h-full">
      <ContentTitleSection title={"Alumnos"} />
      <div className="flex gap-3 w-full flex-1 min-h-0">
        <ProfileSummary
          className="w-70"
          infomations={profileInformations}
          imgSrc={imgSrc}
          status={status}
          planTotalSemesters={planTotalSemesters}
        />

        <Tabs.Root
          value={selectedTab}
          onValueChange={onTabChange}
          className="flex-1 min-w-0 flex flex-col"
        >
          <div className="w-full flex flex-col gap-3">
            <Tabs.List className="flex gap-2">
              <Tabs.Trigger value="overview" asChild>
                <TabBadge
                  label="Generales"
                  selected={selectedTab === "overview"}
                  icon={<Icons.list />}
                  className="data-[state=active]:bg-connecto-muted-panel data-[state=active]:text-connecto-ink"
                />
              </Tabs.Trigger>
              <Tabs.Trigger value="curriculum" asChild>
                <TabBadge
                  label="Plan de estudios"
                  selected={selectedTab === "curriculum"}
                  icon={<Icons.curriculum />}
                  className="data-[state=active]:bg-connecto-muted-panel data-[state=active]:text-connecto-ink"
                />
              </Tabs.Trigger>
            </Tabs.List>
            <div className="w-full h-px bg-DividerMiddle" />
          </div>

          <Tabs.Content value="overview" className="w-full flex-1 min-h-0">
            <StudentOverview
              className="w-full h-full"
              topLeftInformations={topLeftInformations}
              warningInformations={warningInformations}
              requirementInformations={requirementInformations}
              failedClassInformations={failedClassInformations}
            />
            {/* <div className="overflow-y-scroll w-full h-full">
              <div className="mt-4 grid w-full min-w-110 self-start grid-cols-4 gap-4">
                {topLeftInformations.map((props) => (
                  <ProfileDataCard
                    key={props.title}
                    className="h-fit col-span-1"
                    {...props}
                  />
                ))}
                <ProfileDataCard
                  className="col-span-2 row-span-3 col-start-3 row-start-1 h-full"
                  {...warningInformations}
                />
                <ProfileDataCard
                  className="h-fit col-span-2 col-start-3 row-start-4"
                  {...requirementInformations}
                />
                <ProfileDataCard
                  className="h-fit col-span-2 col-start-1 row-start-4"
                  {...failedClassInformations}
                />
              </div>
            </div> */}
          </Tabs.Content>

          <Tabs.Content value="curriculum" className="w-full flex-1 min-h-0 pt-3">
            <DataSection
              className="w-full h-full "
              presets={presets}
              searchText={searchText}
              onSearchTextChange={onSearchTextChange}
              table={table}
              tableConfig={tableConfig}
              metadata={metadata}
              listDiagram={<DataTable config={tableConfig} table={table} />}
              cardDiagram={
                <StudentDiagram
                  items={studentGrades}
                  filterResult={filterResult}
                />
              }
            />
          </Tabs.Content>
        </Tabs.Root>
      </div>
    </div>
  );
}
