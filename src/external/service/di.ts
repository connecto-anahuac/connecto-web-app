import { CourseRepository } from "@/external/repository/course.repository";
import { GradeRepository } from "@/external/repository/grade.repository";
import { OfferingCourseRepository } from "@/external/repository/offering-course.repository";
import { PlanRepository } from "@/external/repository/plan.repository";
import { PreRequisitoRepository } from "@/external/repository/prerequisito.repository";
import { StudentRepository } from "@/external/repository/student.repository";

import { GetOfferingCoursesByCareerService } from "@/external/service/offering-course/get-offering-courses-by-career.service";
import { GetSelectedOfferingCoursesService } from "@/external/service/offering-course/get-selected-offering-courses.service";
import { SetOfferingCourseSelectionService } from "@/external/service/offering-course/set-offering-course-selection.service";
import { GetStudentGradeService } from "@/external/service/student/get-student-plan.service";
import { GetStudentCollectionSummariesService } from "@/external/service/students/get-student-collection-summaries.service";
import { GetStudentsService } from "@/external/service/students/get-students.service";

const studentRepository = new StudentRepository();
const planRepository = new PlanRepository();
const courseRepository = new CourseRepository();
const gradeRepository = new GradeRepository();
const preRequisitoRepository = new PreRequisitoRepository();
const offeringCourseRepository = new OfferingCourseRepository();

export const getStudentsService = new GetStudentsService(studentRepository);

export const getStudentCollectionSummariesService =
  new GetStudentCollectionSummariesService(
    studentRepository,
    gradeRepository,
    planRepository,
  );

export const getStudentPlanService = new GetStudentGradeService(
  planRepository,
  courseRepository,
  studentRepository,
  preRequisitoRepository,
  gradeRepository,
);

export const getOfferingCoursesByCareerService = new GetOfferingCoursesByCareerService(
  planRepository,
  courseRepository,
  studentRepository,
  preRequisitoRepository,
  gradeRepository,
);

export const getSelectedOfferingCoursesService = new GetSelectedOfferingCoursesService(
  offeringCourseRepository,
);

export const setOfferingCourseSelectionService = new SetOfferingCourseSelectionService(
  offeringCourseRepository,
);

export const studentQueryRepository = studentRepository;
