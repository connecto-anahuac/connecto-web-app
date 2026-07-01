import { columnWidths, tableHeaders } from "@/features/home/lib/home-page-data";
import type { CourseRecord } from "@/features/home/types";

type CourseRecordsTableProps = {
  records: CourseRecord[];
};

function CourseRecordsHeaderRow() {
  return (
    <div className="home-table-min flex">
      {tableHeaders.map((header, index) => (
        <div
          key={header}
          className={`${columnWidths[index]} home-table-cell shrink-0 bg-connecto-muted-panel`}
        >
          {header}
        </div>
      ))}
    </div>
  );
}

function CourseRecordsRow({ record }: { record: CourseRecord }) {
  const values = [
    record.code,
    record.number,
    record.title,
    record.grade,
    record.registered,
    record.semesterRegistered,
    record.semesterRecommended,
    record.credit,
    record.hours,
    record.prerequisite,
    record.nextCourse,
  ];

  return (
    <div className="home-table-min flex">
      {values.map((value, index) => (
        <div
          key={`${record.number}-${tableHeaders[index]}`}
          className={`${columnWidths[index]} home-table-cell shrink-0 bg-transparent`}
        >
          <span className="truncate">{value}</span>
        </div>
      ))}
    </div>
  );
}

export function CourseRecordsTable({ records }: CourseRecordsTableProps) {
  return (
    <div className="min-h-0 flex-1 overflow-auto">
      <div className="flex min-h-full flex-col">
        <CourseRecordsHeaderRow />
        {records.map((record) => (
          <CourseRecordsRow key={record.number} record={record} />
        ))}
      </div>
    </div>
  );
}