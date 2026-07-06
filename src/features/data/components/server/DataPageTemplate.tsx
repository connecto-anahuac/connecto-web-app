
import { cn } from "@/shared/lib/util";
import FileSelectorPanel from "@/features/data/components/client/FileSelectorPanel/FileSelectorPanelContainer";
import SourceTable, { type RecordProps } from "@/features/data/components/SourceTable";

const cappRecords: RecordProps[] = [
  {
    career: "Industrial",
    fileName: "CAPP_Industrial(3).csv",
    filePath: "C:/User/Downloads/anahuac/CAPP",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
    updatedBy: "Irving Tlosa",
  },{
    career: "Ambiental",
    fileName: "CAPP_Ambiental.csv",
    filePath: "C:/User/Downloads/anahuac/CAPP",
    updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 13),
    updatedBy: "Xavier Garcia",
  },{
    career: "TIND",
    fileName: "CAPP_TIND_(1).csv",
    filePath: "C:/User/Downloads/anahuac/CAPP",
    updatedAt: new Date(),
    updatedBy: "Benjamin Basulto",
  },{
    career: "Civil",
    fileName: "CAPP_Civil.csv",
    filePath: "C:/User/Downloads/anahuac/CAPP",
    updatedAt: new Date(Date.now() - 1000 * 60 * 2),
    updatedBy: "Ximena Cuevas",
  },
];

export default function DataPageTemplate() {
  return (
    <div className="w-full h-full flex gap-3 p-2.5">
      <FileSelectorPanel className="w-80" />
      
      <div className="flex-1 flex flex-col  min-w-0 h-full px-5 py-5  rounded-lg bg-SurfaceContainerLowest text-OnSurface">
        <div className="flex flex-col gap-4">
          {/* <span className="font-bold text-base">Fuente de los datos</span> */}
          <div className="font-medium text-sm">Fuente de los datos</div>
          <div className="h-0.5 w-full bg-Outline/20" />
        </div>

        <div className="flex flex-col gap-10 w-full h-full min-h-0 overflow-y-auto pt-6">
          <TableSection title={"CAPP"} dbNames={["Student", "StudentGrade"]} records={cappRecords}/>
          <TableSection title={"Plan de Estudios"} dbNames={["Course", "Prerequisito", "Plan"]} records={cappRecords}/>
        </div>

      </div>
    </div>
  );
}



type TableSectionProps = {
  title: string;
  dbNames: string[];
  records: RecordProps[];
};

function TableSection({ title, dbNames, records }: TableSectionProps) {

  return (
    <div className="w-full  flex flex-col gap-4 whitespace-nowrap">
      <Title title={title} dbNames={dbNames}/>
      <SourceTable records={records}/>
    </div>
  );
}

type TitleProps = {
  title: string;
  dbNames: string[];
};

 function Title({  title, dbNames }: TitleProps) {
  return (
    <div className={cn("w-full flex gap-8 items-center")}>
      <div className="flex gap-2 items-center">
        <span className="text-sm font-bold text-OnSurface">{title}</span>
        <span className="w-3.75 h-3.75 text-[0.8rem] flex items-center justify-center leading-none font-semibold text-[#9A9A9A] bg-[#E6E6E6] rounded-4xl">
          ?
        </span>
      </div>

      <div className="flex gap-3 items-center">
        <span className="text-sm font-medium text-[#6C6C6C] whitespace-nowrap">
          Tablas relacionadas de DB:
        </span>

        <span className="flex gap-2.5">
          {dbNames.map((name) => (
            <Badge key={name} txt={name} />
          ))}
        </span>
      </div>
    </div>
  );
}

function Badge({ txt }: { txt: string }) {
  return (
    <div
      className={cn(
        "text-xs font-medium text-OnSurface bg-[#E6E6E6] rounded-sm leading-none  px-2 py-1 w-fit h-fit",
      )}
    >
      {txt}
    </div>
  );
}
