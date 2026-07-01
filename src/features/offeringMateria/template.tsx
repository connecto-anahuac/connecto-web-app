import { useEffect, useState } from "react";
import Diagram from "./Diagram";

export default function OfferingMaterialTemplate() { 
    //   const [student, setStudent] = useState<StudentEntity | null>(null);
    //   const [plan, setPlan] = useState<StudentClassItem[]>([]);
    //   const [loading, setLoading] = useState(true);
    
    //   useEffect(() => {
    //     let mounted = true;
    
    //     async function load() {
    //       setLoading(true);
    //       const studentRepo = new StudentRepository();
    
    //       try {
    //         const s = await studentRepo.findById(studentId);
    //         const items = await getStudentPlanUseCase.execute(studentId);
    //         if (!mounted) return;
    //         setStudent(s ?? null);
    //         setPlan(items);
    //         console.log(items);
    //       } catch (err) {
    //         // keep simple error handling for now
    //         // eslint-disable-next-line no-console
    //         console.error("Failed loading student plan", err);
    //       } finally {
    //         if (mounted) setLoading(false);
    //       }
    //     }
    
    //     load();
    //     return () => {
    //       mounted = false;
    //     };
    //   }, [studentId]);
    
    //   if (loading) return <div>Loading...</div>;
    //   if (!student) return <div>Student not found</div>;
    
    //   const semesters = Array.from(
    //     new Set(plan.map((p) => p.semester).filter(Boolean as any)),
    //   ).sort((a, b) => a - b);
    //   const maxSemester = semesters.length ? Math.max(...semesters) : 1;
    //   const maxPosition = plan.length
    //     ? Math.max(...plan.map((p) => p.position))+1
    //     : 1;
    return (
        <div>
            <Diagram maxSemester={maxSemester} maxPosition={maxPosition}>

            </Diagram>
        </div>
    )
}