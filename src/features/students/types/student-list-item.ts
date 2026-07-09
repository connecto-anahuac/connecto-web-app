import { Period } from "@/shared/types/Period";

export type StudentListItem = {
  id: string;
  name: string;
  status: string;
  career: string;
  plan: string;
  currentSemester: string;
  failCount: number;
  avatarColorCssVar: string;
  enrolledPeriod: Period;
};

// export type StudentListItem = {
//   id: string;
//   name: string;
//   status: string;
//   career: string;
//   plan: string;
//   semester: string;
//   reprobado: number;
//   avatarColorCssVar: string;
// };

