import type { ReactNode } from "react";
import PersonIcon from "@/components/icon/PersonIcon";
import ScheduleIcon from "@/components/icon/ScheduleIcon";
import SchoolHatIcon from "@/components/icon/SchoolHatIcon";
import StatusIcon from "@/components/icon/StatusIcon";
import EditIcon from "@/components/icon/EditIcon";
import ToolOutlineIcon from "@/components/icon/ToolOutlineIcon";
import { STUDENT_FILTER_KEYS } from "../../student/types/student-filter-fields";
import { STUDENT_PLAN_FILTER_KEYS } from "../../student/types/student-plan-filter-fields";

/**
 * プレゼンテーション専用: field key -> 表示アイコン。
 *
 * behavior（filter-field / filter-definition）は JSX を持たずシリアライズ可能に保ち、
 * アイコンなどの表示情報はここで field key に紐付けて分離管理する。
 */
export const STUDENT_FILTER_ICONS: Record<string, ReactNode> = {
  [STUDENT_FILTER_KEYS.name]: <PersonIcon />,
  [STUDENT_FILTER_KEYS.status]: <StatusIcon />,
  [STUDENT_FILTER_KEYS.currentSemester]: <ScheduleIcon />,
  [STUDENT_FILTER_KEYS.career]: <SchoolHatIcon />,
  [STUDENT_FILTER_KEYS.plan]: <ScheduleIcon />,
  [STUDENT_PLAN_FILTER_KEYS.className]: <EditIcon />,
  [STUDENT_PLAN_FILTER_KEYS.classCodeAndNumber]: <ToolOutlineIcon />,
  [STUDENT_PLAN_FILTER_KEYS.period]: <ScheduleIcon />,
  [STUDENT_PLAN_FILTER_KEYS.grade]: <StatusIcon />,
};

export function getStudentFilterIcon(key: string): ReactNode | undefined {
  return STUDENT_FILTER_ICONS[key];
}
