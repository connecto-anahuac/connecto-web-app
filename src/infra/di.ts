import { GetStudentsUseCase } from "@/features/students/usecase/get_students";
import { StudentRepository } from "./local/repository/student.repository";
import { PlanRepository } from "./local/repository/plan.repository";
import { MateriaRepository } from "./local/repository/materia.repository";
import { GradeRepository } from "./local/repository/grade.repository";
import { PreRequisitoRepository } from "./local/repository/prerequisito.repository";
import { GetStudentPlanUseCase } from "@/features/student/usecase/get_plan";
import { GetOfferingMaterialsByCareerUseCase } from "@/features/offeringMateria/usecase/get_offering_materials_by_career";
import { GetSelectedOfferingMaterialsUseCase } from "@/features/offeringMateria/usecase/get_selected_offering_materials";
import { SetOfferingMaterialSelectionUseCase } from "@/features/offeringMateria/usecase/set_offering_material_selection";
import { OfferingMaterialRepository } from "./local/repository/offering_material.repository";


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
        const offeringMaterialRepo = new OfferingMaterialRepository();
  
       export const getStudentPlanUseCase = new GetStudentPlanUseCase(
          planRepo,
          materiaRepo,
          studentRepository,
          preRepo,
          gradeRepo,
        );

export const getOfferingMaterialsByCareerUseCase =
  new GetOfferingMaterialsByCareerUseCase(
    planRepo,
    materiaRepo,
    studentRepository,
    preRepo,
    gradeRepo,
  );

export const getSelectedOfferingMaterialsUseCase =
  new GetSelectedOfferingMaterialsUseCase(
    offeringMaterialRepo,
  );

export const setOfferingMaterialSelectionUseCase =
  new SetOfferingMaterialSelectionUseCase(
    offeringMaterialRepo,
  );