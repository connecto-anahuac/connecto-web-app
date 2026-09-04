import ProfileDataCard, {
  ProfileDataCardProps,
} from "@/shared/component/composite/profileSummary/card/ProfileDataCard";
import { cn } from "@/shared/lib/util";

export type StudentOverviewProps = {
  //   studentGrades: readonly StudentClassItem[];
  //   table: Table<StudentClassItem>;
  //   tableConfig: DataViewConfig<StudentClassItem>;
  //   searchText: string;
  //   onSearchTextChange: (value: string) => void;
  //   presets: readonly FilterPreset[];
  //   filterResult: FilterResult;
  //   metadata: DataViewMetadata;
  //   profileInformations: Informations;
  //   imgSrc: string;
  //   status: StudentStatus;
  //   planTotalSemesters: number;
  topLeftInformations: ProfileDataCardProps[];
  warningInformations: ProfileDataCardProps;
  requirementInformations: ProfileDataCardProps;
  failedClassInformations: ProfileDataCardProps;
  className?: string;
};

export function StudentOverview({
  topLeftInformations,
  warningInformations,
  requirementInformations,
  failedClassInformations,
  className,
}: StudentOverviewProps) {
  return (
    <div className={cn("overflow-y-scroll w-full h-full", className)}>
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
    </div>
  );
}
