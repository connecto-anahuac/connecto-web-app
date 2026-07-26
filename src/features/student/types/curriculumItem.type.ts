export type CurriculumItem = {
  id: string;
  keyCode: string;
  keyNumber: string;
  name: string;
  hours: number;
  credits: number;
  block: string;
  career: string;
  preRequisites: CurriculumItem[];
  semester: number;
  position: number;
};