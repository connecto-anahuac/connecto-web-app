import type { ReactNode } from "react";
import PersonIcon from "@/components/icon/PersonIcon";
import ScheduleIcon from "@/components/icon/ScheduleIcon";
import SchoolHatIcon from "@/components/icon/SchoolHatIcon";
import StatusIcon from "@/components/icon/StatusIcon";
import { STUDENT_FILTER_KEYS } from "./student-filter-fields";

/**
 * プレゼンテーション専用: field key -> 表示アイコン。
 *
 * behavior（filter-field / filter-definition）は JSX を持たずシリアライズ可能に保ち、
 * アイコンなどの表示情報はここで field key に紐付けて分離管理する。
 */
export const STUDENT_FILTER_ICONS: Record<string, ReactNode> = {
  [STUDENT_FILTER_KEYS.name]: <PersonIcon />,
  [STUDENT_FILTER_KEYS.status]: <StatusIcon />,
  [STUDENT_FILTER_KEYS.semester]: <ScheduleIcon />,
  [STUDENT_FILTER_KEYS.career]: <SchoolHatIcon />,
  [STUDENT_FILTER_KEYS.plan]: <ScheduleIcon />,
};

export function getStudentFilterIcon(key: string): ReactNode | undefined {
  return STUDENT_FILTER_ICONS[key];
}
