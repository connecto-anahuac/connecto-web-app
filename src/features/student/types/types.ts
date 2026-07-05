export type Contact = {
  schoolEmail: string;
  privateEmail: string;
  phone: string;
};

export type StudentProfile = {
  id: string;
  name: string;
  status: string;
  enrolledPeriod: string;
  currentSemester: number;
};

export type CurriculumItem = {
  id: string; // clave
  keyCode: string;
  keyNumber: string;
  name: string;
  hours: number;
  credits: number;
  block: string;
  career: string;
  preRequisites: CurriculumItem[];

  //location
  semester: number;
  position: number;
};

export type StudentClassItem = {
  id: string; // clave
  keyCode: string;
  keyNumber: string;
  name: string;
  hours: number;
  credits: number;
  block: string;
  preRequisites: StudentClassItem[];

  //grade
  period: string;
  grade: number;

  //location
  semester: number;
  position: number;
};
