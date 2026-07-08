import PersonIcon from "@/components/icon/PersonIcon";
import ScheduleIcon from "@/components/icon/ScheduleIcon";
import SchoolHatIcon from "@/components/icon/SchoolHatIcon";
import StatusIcon from "@/components/icon/StatusIcon";

export type FilterMetadata = {
  label: string;
  icon?: React.ReactNode;
};

export const enum StudentFilterMetadataKeys {
  name = "nombre",
  semester = "semestre",
  status = "estatus",
  grade = "calificacion",
}
export const STUDENT_FILTER_METADATA: Record<StudentFilterMetadataKeys, FilterMetadata> = {
  [StudentFilterMetadataKeys.name]: { label: "Nombre", icon: <PersonIcon /> },
  [StudentFilterMetadataKeys.semester]: { label: "Semestre" , icon: <ScheduleIcon /> },
  [StudentFilterMetadataKeys.status]: { label: "Estatus", icon: <StatusIcon /> },
  [StudentFilterMetadataKeys.grade]: { label: "Calificación", icon: <SchoolHatIcon /> },
};
