"use client";

import { useEffect, useState } from "react";
import { getStudentsUseCase } from "@/infra/di";
import { StudentEntity } from "@/infra/local/entities";

export function StudentsPageTemplate() {
  const [students, setStudents] = useState<StudentEntity[]>([]);
  const [loading, setLoading] = useState(true);

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
    <main className="min-h-screen bg-white text-connecto-ink flex flex-col gap-7">
      {students.map((student) => (
        <div key={student.id} className="flex gap-3">
          {student.name}, {student.status}, {student.id}
        </div>
      ))}
    </main>
  );
}