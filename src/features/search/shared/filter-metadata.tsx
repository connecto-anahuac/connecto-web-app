import PersonIcon from "@/components/icon/PersonIcon";
import ScheduleIcon from "@/components/icon/ScheduleIcon";
import StatusIcon from "@/components/icon/StatusIcon";

export type FilterMetadata = {
  label: string;
  icon?: React.ReactNode;
};

export const enum FilterMetadataKeys {
  name = "nombre",
  semester = "semestre",
  status = "estatus",
}
export const FILTER_METADATA: Record<FilterMetadataKeys, FilterMetadata> = {
  [FilterMetadataKeys.name]: { label: "Nombre", icon: <PersonIcon /> },
  [FilterMetadataKeys.semester]: { label: "Semestre" , icon: <ScheduleIcon /> },
  [FilterMetadataKeys.status]: { label: "Estatus", icon: <StatusIcon /> },
};
