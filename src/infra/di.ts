import { GetStudentsUseCase } from "@/features/students/usecase/get_students";
import { StudentRepository } from "./local/repository/student.repository";
import { PlanRepository } from "./local/repository/plan.repository";
import { MateriaRepository } from "./local/repository/materia.repository";
import { GradeRepository } from "./local/repository/grade.repository";
import { PreRequisitoRepository } from "./local/repository/prerequisito.repository";
import { GetStudentPlanUseCase } from "@/features/student/usecase/get_plan";


const studentRepository =
    new StudentRepository();
  
export const getStudentsUseCase =
  new GetStudentsUseCase(
    studentRepository,
  );



        const planRepo = new PlanRepository();
        const materiaRepo = new MateriaRepository();
        const gradeRepo = new GradeRepository();
        const preRepo = new PreRequisitoRepository();
  
       export const getStudentPlanUseCase = new GetStudentPlanUseCase(
          planRepo,
          materiaRepo,
          studentRepository,
          preRepo,
          gradeRepo,
        );