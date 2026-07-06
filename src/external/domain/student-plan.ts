export type StudentClassItem = {
  id: string;
  keyCode: string;
  keyNumber: string;
  name: string;
  hours: number;
  credits: number;
  block: string;
  preRequisites: StudentClassItem[];
  period: string;
  grade: number;
  semester: number;
  position: number;
};