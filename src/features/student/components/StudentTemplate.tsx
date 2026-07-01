"use client";

import { useEffect, useState } from "react";
import { StudentEntity } from "@/infra/local/entities";
import { GetStudentPlanUseCase } from "../usecase/get_plan";
import { PlanRepository } from "@/infra/local/repository/plan.repository";
import { MateriaRepository } from "@/infra/local/repository/materia.repository";
import { StudentRepository } from "@/infra/local/repository/student.repository";
import { GradeRepository } from "@/infra/local/repository/grade.repository";
import { PreRequisitoRepository } from "@/infra/local/repository/prerequisito.repository";
import StudentClassCardView from "./ClassCardView";
import { StudentClassItem } from "../types/types";
import { getStudentPlanUseCase } from "@/infra/di";
import ColumnTitle from "@/components/ColumnTitle";
import RowTitle from "@/components/RowTitle";

type Props = { studentId: string };

export default function StudentTemplate({ studentId }: Props) {
  const [student, setStudent] = useState<StudentEntity | null>(null);
  const [plan, setPlan] = useState<StudentClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      const studentRepo = new StudentRepository();

      try {
        const s = await studentRepo.findById(studentId);
        const items = await getStudentPlanUseCase.execute(studentId);
        if (!mounted) return;
        setStudent(s ?? null);
        setPlan(items);
        console.log(items);
      } catch (err) {
        // keep simple error handling for now
        // eslint-disable-next-line no-console
        console.error("Failed loading student plan", err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();
    return () => {
      mounted = false;
    };
  }, [studentId]);

  if (loading) return <div>Loading...</div>;
  if (!student) return <div>Student not found</div>;

  const semesters = Array.from(
    new Set(plan.map((p) => p.semester).filter(Boolean as any)),
  ).sort((a, b) => a - b);
  const maxSemester = semesters.length ? Math.max(...semesters) : 1;
  const maxPosition = plan.length
    ? Math.max(...plan.map((p) => p.position))+1
    : 1;

  return (
    <div className="w-full min-h-full h-full p-4 overflow-auto">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">{student.name}</h2>
        <div className="text-sm text-gray-500">{student.enrolledPeriod}</div>
      </div>

      <div
        className="w-fit"
        style={{
          display: "grid",
          // first column for row titles should size to its content; remaining columns are responsive
          gridTemplateColumns: `auto repeat(${maxSemester}, minmax(13rem, 1fr))`,
          gridAutoRows: "min-content",
          gap: "1rem",
        }}
      >

        <div
          key={`table-edge`}
          className="w-fit"
              style={{
                gridColumnStart: 1,
                gridRowStart: 1,
                // corner cell — keep above others when scrolling
                position: "sticky",
                top: 0,
                left: 0,
                zIndex: 30,
                background: "transparent",
              }}
        >
          <div className="w-4" />
        </div>
        
        {Array.from({ length: maxPosition }, (_, i) => {
          const position = i + 1;
          return (
            <div
              key={`position-${position}`}
              style={{
                gridColumnStart: 1,
                gridRowStart: position+1, 
                position: "sticky",
                left: 0,
                zIndex: 20,
                // background: "rgba(243,244,246,1)",
              }}
            >
              <RowTitle text={String.fromCharCode(64 + position)} />
            </div>
          );
        })}
        
        {Array.from({ length: maxSemester }, (_, i) => {
          const semester = i + 1;
          return (
            <div
              key={`semester-${semester}`}
              style={{
                gridColumnStart: semester+1,
                gridRowStart: 1, 
                position: "sticky",
                top: 0,
                zIndex: 25,
                // background: "rgba(229,231,235,1)",
              }}
            >
              <ColumnTitle text={`Semestre ${semester}`} />
            </div>
          );
        })}

        {plan.map((item) => (
          <div
            key={item.id}
            style={{
              gridColumnStart: item.semester +1|| 2,
              gridRowStart: item.position + 1+1 || 2,
            }}
          >
            <StudentClassCardView
              className="w-full"
              courseCode={item.keyCode || item.id}
              courseNumber={item.keyNumber || ""}
              title={item.name}
              period={item.period}
              grade={item.grade}
              credits={item.credits ? item.credits.toString() : undefined}
              hours={item.hours ? item.hours.toString() : undefined}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
