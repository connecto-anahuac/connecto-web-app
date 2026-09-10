import type { ProfessorCollectionDto, ProfessorDetailDto } from "@/external/dto/professor/professor.dto";
import { WEEK_DAYS } from "@/external/domain/university";
import { ClassroomRepository } from "@/external/repository/classroom.repository";
import { CourseRepository } from "@/external/repository/course.repository";
import { ProfessorRepository } from "@/external/repository/professor.repository";
import { TimeSlotRepository } from "@/external/repository/time-slot.repository";

const minutes = (time: string) => { const [hours, mins] = time.split(":").map(Number); return hours * 60 + mins; };
export class GetProfessorsService {
  constructor(private professors: ProfessorRepository, private courses: CourseRepository, private classrooms: ClassroomRepository, private slots: TimeSlotRepository) {}
  private async data() { return Promise.all([this.professors.findAll(), this.professors.findCapabilities(), this.professors.findAssignments(), this.professors.findAvailabilities(), this.courses.findAll(), this.classrooms.findAll(), this.slots.findAll()]); }
  async execute(period?: string): Promise<ProfessorCollectionDto[]> {
    const [professors, capabilities, assignments, availabilities, , , slots] = await this.data();
    const selected = period || [...capabilities, ...assignments, ...availabilities].map((x) => x.period).sort().at(-1) || "";
    const slotById = new Map(slots.map((slot) => [slot.id, slot]));
    return professors.map((professor) => {
      const caps = capabilities.filter((x) => x.professorId === professor.id && x.period === selected);
      const assigned = assignments.filter((x) => x.professorId === professor.id && x.period === selected);
      return { ...professor, assignableSubjects: new Set(caps.map((x) => x.courseId)).size, assigned: new Set(assigned.map((x) => x.courseId)).size, assignedHours: assigned.reduce((sum, x) => { const slot = slotById.get(x.timeSlotId); return sum + (slot ? (minutes(slot.endTime) - minutes(slot.startTime)) / 60 : 0); }, 0) };
    });
  }
  async detail(id: string, period?: string): Promise<ProfessorDetailDto | undefined> {
    const [professors, capabilities, assignments, availabilities, courses, classrooms, slots] = await this.data();
    const professor = professors.find((x) => x.id === id); if (!professor) return undefined;
    const relatedPeriods = [...capabilities, ...assignments, ...availabilities].filter((x) => x.professorId === id).map((x) => x.period);
    const selected = period || relatedPeriods.sort().at(-1) || "";
    const caps = capabilities.filter((x) => x.professorId === id && x.period === selected);
    const assigned = assignments.filter((x) => x.professorId === id && x.period === selected);
    const availabilityByDayAndSlot = new Map(availabilities.filter((x) => x.professorId === id && x.period === selected).map((x) => [`${x.day}:${x.timeSlotId}`, x.isAvailable]));
    const courseById = new Map(courses.map((x) => [x.key, x])); const classroomById = new Map(classrooms.map((x) => [x.id, x])); const slotById = new Map(slots.map((x) => [x.id, x])); const sortedSlots = [...slots].sort((a, b) => a.position - b.position);
    const assignedHours = assigned.reduce((sum, x) => { const slot = slotById.get(x.timeSlotId); return sum + (slot ? (minutes(slot.endTime) - minutes(slot.startTime)) / 60 : 0); }, 0);
    return { ...professor, period: selected, assigned: new Set(assigned.map((x) => x.courseId)).size, assignableSubjects: new Set(caps.map((x) => x.courseId)).size, assignedHours,
      assignedSubjects: assigned.map((x) => ({ courseId: x.courseId, course: courseById.get(x.courseId)?.name ?? x.courseId, timeSlot: x.timeSlotId, classroom: classroomById.get(x.classroomId)?.name ?? x.classroomId })),
      availability: WEEK_DAYS.flatMap((day) => sortedSlots.map((slot) => { const value = availabilityByDayAndSlot.get(`${day}:${slot.id}`); return { day, timeSlotId: slot.id, startTime: slot.startTime, endTime: slot.endTime, position: slot.position, submissionStatus: value === undefined ? "unsubmitted" : value ? "available" : "unavailable", isAvailable: value ?? null }; })),
    };
  }
}
