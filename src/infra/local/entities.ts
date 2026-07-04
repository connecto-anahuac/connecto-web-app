// src/domain/entities/materia.ts

export type MateriaEntity = {
  key: string;
  keyCode: string;
  keyNumber: string;
  hours: number;
  credits: number;
  block: string;
  name: string;
};
export type PlanEntity = {
  id: string;
  name: string;
  career: string;
  materiaKey: string;
  semester: number;
  position: number;
};

// src/domain/entities/pre-requisito.ts

export type PreRequisitoEntity = {
  id: string;
  currentMateriaKey: string;
  preMateriaKey: string;
};

// src/domain/entities/student.ts

export type StudentEntity = {
  id: string;
  name: string;
  status: string;
  enrolledPeriod: string;
  currentSemester: number;
  currentSemesterWithoutSummer: number;
};

// src/domain/entities/grade.ts

export type GradeEntity = {
  id?: number;
  studentId: string;
  materiaKey: string;
  // period: string;
  // grade: number;

  grade: number | null;
  period: string | null;
  value: boolean | null;
  as: "default" | "TINT" | "REGIONALES";
};

export type OfferingMaterialEntity = {
  id: string;
  period: string;
  career: string;
  materiaKey: string;
  sessionNumber: number;
  estimatedNumber: number;
};