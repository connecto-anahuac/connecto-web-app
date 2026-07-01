"use client";

import { useEffect, useState } from "react";
import { getStudentsUseCase } from "@/infra/di";
import { StudentEntity } from "@/infra/local/entities";
import StudentCardView from "./StudentCardView";
import Link from "next/link";

// type Props = Extend<React.HTMLAttributes<HTMLDivElement>, {}> & {
  
// }
export function StudentsPageTemplate({children, ...props}: React.HTMLAttributes<HTMLDivElement>) {
  const [students, setStudents] = useState<StudentEntity[]>([]);
  const [loading, setLoading] = useState(true);
  const [isClicked, setIsClicked] = useState("");
  

  useEffect(() => {
    async function loadStudents() {
      try {
        const result = await getStudentsUseCase.execute();
        setStudents(result);
      } finally {
        setLoading(false);
      }
    }

    loadStudents();
  }, []);

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-connecto-ink">
        Loading...
      </main>
    );
  }

  return (
    <div className="flex  gap-5  w-full h-full  max-h-full min-h-0 p-2.5">
      <div className=" min-h-0 h-full w-80 shrink-0  flex flex-col gap-2 overflow-y-auto p-2.5 rounded-lg border border-divider bg-header">
        {students.map((student) => (
          <Link 
            key={student.id}
            href={`/students/${student.id}`}
            className="w-full h-fit"
            onClick={(e) => { 
              setIsClicked(student.id);
            }}
          >
            
          <StudentCardView className={`w-full ${isClicked === student.id ? "bg-orange-100" : ""}`} student={{
            img: "",
            name: student.name,
            status: student.status,
            carrier: "TIND",
            plan: "plan 2020",
            id: student.id,
            semester: "4",//student.semester,
            advance: 36,//student.advance,
            requirements: 1 ,//student.requirements,
            contact: {
              schoolEmail: "student.contact.schoolEmail",
              privateEmail: "student.contact.privateEmail",
              phone: "student.contact.phone"
            },
            memo: ""
          }} />
          </Link>
        ))}
      </div>
      
      <div className="flex-1 h-full min-w-0">{children}</div>
    </div>
  );
}