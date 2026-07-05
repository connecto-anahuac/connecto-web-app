export type OfferingCourse = {
  key: string;
  keyCode: string;
  keyNumber: string;
  hours: number;
  credits: number;
  block: string;
  name: string;
  semester: number;
  position: number;
  preRequisites: string[];

  possibleStudentIds: Record<number, string[]>;// semester:studentId
//   estimatedNumberOfStudents: number;
};


