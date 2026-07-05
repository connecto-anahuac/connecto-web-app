"use client";

import { useEffect, useState } from "react";
import { db } from "../../infra/local/databse";

const STUDENTS_URL = "/dev_untrack/data/students.json";
const CAPP_URL = "/dev_untrack/data/capp_student_data.json";
const MATERIAS_URL = "/dev_untrack/data/materias/Materias_ingenierias.json";
const PLANS_URL = "/dev_untrack/data/materias/Materias_TIND.json";

export default function DbInicializer() {
	const [status, setStatus] = useState<string>("idle");

	useEffect(() => {
		let mounted = true;

		async function seed() {
			try {
				setStatus("checking");

				const count = await db.students.count();
				if (count > 0) {
					setStatus("already-seeded");
					return;
				}

				setStatus("fetching-students");
				const studentsRes = await fetch(STUDENTS_URL);
				const studentsJson = await studentsRes.json();

				const students = (studentsJson || []).map((s: any) => ({
					id: String(s.id),
					name: s.name ?? "",
					status: s.status ?? "",
					initialPeriod: String(s.inicial ?? s.initial ?? ""),
				}));

				setStatus("writing-students");

				await db.transaction(
					"rw",
					db.students,
					db.grades,
					db.Courses,
					db.plans,
					db.preRequisitos,
					async () => {
						if (students.length) await db.students.bulkPut(students as any);

						// Courses
						setStatus("fetching-Courses");
						const CoursesRes = await fetch(MATERIAS_URL);
						const CoursesJson = await CoursesRes.json();

						const Courses = (CoursesJson || [])
							.filter((m: any) => m && m.clave && m.clave.raw)
							.map((m: any) => ({
								id: String(m.clave.raw),
								keyCode: String(m.clave.code ?? ""),
								keyNumber: String(m.clave.number ?? ""),
								hours: typeof m.horas === "number" ? m.horas : null,
								credits: typeof m.creditos === "number" ? m.creditos : null,
								block: m.bloque ?? "",
								name: m.Course ?? "",
							}));

						if (Courses.length) await db.Courses.bulkPut(Courses as any);

						// plans
						setStatus("fetching-plans");
						const plansRes = await fetch(PLANS_URL);
						const plansJson = await plansRes.json();

						const plans = (plansJson || [])
							.filter((p: any) => p && p.clave && p.clave.raw)
							.map((p: any, idx: number) => ({
								id: `${String(p.clave.raw)}_${idx}`,
								name:  "plan 2020",
								career: "TIND",
								CourseId: String(p.clave.raw),
								semester: p.semester != null ? Number(p.semester) : null,
								position: p.position != null ? Number(p.position) : null,
							}));

						if (plans.length) await db.plans.bulkPut(plans as any);

						// preRequisitos: from CoursesJson.pre_requisito
						const prereqs: any[] = [];
						(CoursesJson || []).forEach((m: any) => {
							const current = m?.clave?.raw;
							if (!current) return;
							const pres = Array.isArray(m.pre_requisito) ? m.pre_requisito : [];
							pres.forEach((pr: any, i: number) => {
								const preRaw = pr?.raw;
								if (!preRaw) return;
								prereqs.push({
									id: `${String(current)}_${String(preRaw)}_${i}`,
									currentCourseId: String(current),
									preCourseId: String(preRaw),
								});
							});
						});

						if (prereqs.length) await db.preRequisitos.bulkPut(prereqs as any);

						// grades
						setStatus("fetching-grades");
						const gradesRes = await fetch(CAPP_URL);
						const gradesJson = await gradesRes.json();

						const grades = (gradesJson || []).map((g: any, idx: number) => ({
							id: `${g.student_id ?? ""}_${g.class_code ?? ""}_${g.period ?? ""}_${idx}`,
							studentId: String(g.student_id ?? ""),
							CourseId: String(g.class_code ?? ""),
							period: String(g.period ?? ""),
							grade: typeof g.grade === "number" ? g.grade : null,
							as: g.as ?? "",
						}));

						if (grades.length) await db.grades.bulkPut(grades as any);
					}
				);

				if (mounted) setStatus("done");
			} catch (err) {
				// keep simple error handling for dev initializer
				// eslint-disable-next-line no-console
				console.error("DB initializer error:", err);
				if (mounted) setStatus("error");
			}
		}

		seed();

		return () => {
			mounted = false;
		};
	}, []);

	// Hidden UI element that lets devs know seeding status in the DOM.
	return <div style={{ display: "none" }} data-db-seed-status={status} />;
}