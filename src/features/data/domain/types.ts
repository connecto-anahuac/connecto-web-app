export interface StudentEntity {
  id: string | null;
  name: string | null;
  status: string | null;
  enrolledPeriod: string | null;
}

export interface GradeEntity {
  studentId: string | null;
  courseKey: string;
  grade?: number | null;
  period?: string | null;
  value?: boolean;
  as: "default" | "TINT" | "REGIONALES";
}