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
    <div className={cn("overflow-y-scroll w-full h-full @container", className)}>
      <div className="mt-4 grid w-full self-start grid-cols-4 gap-4 @max-[500px]:grid-cols-2">
       
        <ProfileDataCard
          className="col-span-2 row-span-3 col-start-3 row-start-1 h-full @max-[500px]:col-start-1 @max-[500px]:row-start-auto "
          {...warningInformations}
        />
        {topLeftInformations.map((props) => (
          <ProfileDataCard
            key={props.title}
            className="h-fit col-span-1 "
            {...props}
          />
        ))}
        <ProfileDataCard
          className="h-fit col-span-2 col-start-3 row-start-4 @max-[500px]:col-start-1 @max-[500px]:row-start-auto"
          {...requirementInformations}
        />
        <ProfileDataCard
          className="h-fit col-span-2 col-start-1 row-start-4 @max-[500px]:col-start-1 @max-[500px]:row-start-auto"
          {...failedClassInformations}
        />
      </div>
    </div>
  );
}
