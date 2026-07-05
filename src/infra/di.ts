import { GetStudentsUseCase } from "@/features/students/usecase/get_students";
import { StudentRepository } from "./local/repository/student.repository";
import { PlanRepository } from "./local/repository/plan.repository";
import { CourseRepository } from "./local/repository/course.repository";
import { GradeRepository } from "./local/repository/grade.repository";
import { PreRequisitoRepository } from "./local/repository/prerequisito.repository";
import { GetStudentPlanUseCase } from "@/features/student/usecase/get_plan";
import { OfferingCourseRepository } from "./local/repository/offering_material.repository";
import { GetOfferingCoursesByCareerUseCase } from "@/features/offeringCourse/usecase/get_offering_materials_by_career";
import { GetSelectedOfferingCoursesUseCase } from "@/features/offeringCourse/usecase/get_selected_offering_materials";
import { SetOfferingCourseselectionUseCase } from "@/features/offeringCourse/usecase/set_offering_material_selection";


const studentRepository =
    new StudentRepository();
  
export const getStudentsUseCase =
  new GetStudentsUseCase(
    studentRepository,
  );



        const planRepo = new PlanRepository();
        const courseRepo = new CourseRepository();
        const gradeRepo = new GradeRepository();
        const preRepo = new PreRequisitoRepository();
        const offeringCourseRepo = new OfferingCourseRepository();
  
       export const getStudentPlanUseCase = new GetStudentPlanUseCase(
          planRepo,
          courseRepo,
          studentRepository,
          preRepo,
          gradeRepo,
        );

export const getOfferingCoursesByCareerUseCase =
  new GetOfferingCoursesByCareerUseCase(
    planRepo,
    courseRepo,
    studentRepository,
    preRepo,
    gradeRepo,
  );

export const getSelectedOfferingCoursesUseCase =
  new GetSelectedOfferingCoursesUseCase(
    offeringCourseRepo,
  );

export const setOfferingCourseselectionUseCase =
  new SetOfferingCourseselectionUseCase(
    offeringCourseRepo,
  );