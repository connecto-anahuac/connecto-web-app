import { CourseRepository } from "@/external/repository/course.repository";
import { GradeRepository } from "@/external/repository/grade.repository";
import { OfferingCourseRepository } from "@/external/repository/offering-course.repository";
import { PlanRepository } from "@/external/repository/plan.repository";
import { PreRequisitoRepository } from "@/external/repository/prerequisito.repository";
import { StudentRepository } from "@/external/repository/student.repository";
import { ClassroomRepository } from "@/external/repository/classroom.repository";
import { ProfessorRepository } from "@/external/repository/professor.repository";
import { StudyPlanRepository } from "@/external/repository/study-plan.repository";
import { TimeSlotRepository } from "@/external/repository/time-slot.repository";
import { GetCoursesService } from "@/external/service/course/get-courses.service";
import { GetClassroomsService } from "@/external/service/classroom/get-classrooms.service";
import { GetProfessorsService } from "@/external/service/professor/get-professors.service";
import { GetStudyPlansService } from "@/external/service/study-plan/get-study-plans.service";

import { GetOfferingCoursesByCareerService } from "@/external/service/offering-course/get-offering-courses-by-career.service";
import { GetOfferingCourseDetailService } from "@/external/service/offering-course/get-offering-course-detail.service";
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
const classroomRepository = new ClassroomRepository();
const professorRepository = new ProfessorRepository();
const studyPlanRepository = new StudyPlanRepository();
const timeSlotRepository = new TimeSlotRepository();

export const getCoursesService = new GetCoursesService(courseRepository, preRequisitoRepository);
export const getClassroomsService = new GetClassroomsService(classroomRepository);
export const getProfessorsService = new GetProfessorsService(professorRepository, courseRepository, classroomRepository, timeSlotRepository);
export const getStudyPlansService = new GetStudyPlansService(studyPlanRepository, planRepository, courseRepository);

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
  preRequisitoRepository,
  studentRepository,
  gradeRepository,
);

export const getOfferingCourseDetailService = new GetOfferingCourseDetailService(
  planRepository,
  studyPlanRepository,
  courseRepository,
  studentRepository,
  gradeRepository,
  preRequisitoRepository,
  offeringCourseRepository,
);

export const getSelectedOfferingCoursesService = new GetSelectedOfferingCoursesService(
  offeringCourseRepository,
);

export const setOfferingCourseSelectionService = new SetOfferingCourseSelectionService(
  offeringCourseRepository,
);

export const studentQueryRepository = studentRepository;
