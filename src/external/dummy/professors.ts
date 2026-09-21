import type {
  ProfessorAvailabilityRecord,
  ProfessorCourseCapabilityRecord,
  ProfessorRecord,
  WeekDay,
} from "@/external/domain/university";

const PERIOD = "202660";

export const dummyProfessors: ProfessorRecord[] = [
  { id: "P001", name: "Ana Torres", status: "active", career: "TIND", job: "Profesora de tiempo completo", email1: "ana.torres@university.test", email2: "", phone: "555-0101" },
  { id: "P002", name: "Carlos Mendoza", status: "active", career: "TIND", job: "Profesor de asignatura", email1: "carlos.mendoza@university.test", email2: "", phone: "555-0102" },
  { id: "P003", name: "Elena Ruiz", status: "active", career: "TIND", job: "Profesora de tiempo completo", email1: "elena.ruiz@university.test", email2: "", phone: "555-0103" },
  { id: "P004", name: "Diego Salazar", status: "active", career: "TIND", job: "Profesor de asignatura", email1: "diego.salazar@university.test", email2: "", phone: "555-0104" },
  { id: "P005", name: "Mariana López", status: "active", career: "Civil", job: "Profesora de tiempo completo", email1: "mariana.lopez@university.test", email2: "", phone: "555-0105" },
  { id: "P006", name: "Jorge Ramírez", status: "active", career: "Civil", job: "Profesor de asignatura", email1: "jorge.ramirez@university.test", email2: "", phone: "555-0106" },
  { id: "P007", name: "Patricia Gómez", status: "active", career: "Civil", job: "Profesora de tiempo completo", email1: "patricia.gomez@university.test", email2: "", phone: "555-0107" },
  { id: "P008", name: "Ricardo Navarro", status: "active", career: "Civil", job: "Profesor de asignatura", email1: "ricardo.navarro@university.test", email2: "", phone: "555-0108" },
  { id: "P009", name: "Sofía Herrera", status: "active", career: "Ambiental", job: "Profesora de tiempo completo", email1: "sofia.herrera@university.test", email2: "", phone: "555-0109" },
  { id: "P010", name: "Miguel Castro", status: "active", career: "Ambiental", job: "Profesor de asignatura", email1: "miguel.castro@university.test", email2: "", phone: "555-0110" },
  { id: "P011", name: "Laura Cárdenas", status: "active", career: "Ambiental", job: "Profesora de tiempo completo", email1: "laura.cardenas@university.test", email2: "", phone: "555-0111" },
  { id: "P012", name: "Héctor Fuentes", status: "active", career: "Ambiental", job: "Profesor de asignatura", email1: "hector.fuentes@university.test", email2: "", phone: "555-0112" },
  { id: "P013", name: "Valeria Morales", status: "active", career: "Industrial", job: "Profesora de tiempo completo", email1: "valeria.morales@university.test", email2: "", phone: "555-0113" },
  { id: "P014", name: "Fernando Ortiz", status: "active", career: "Industrial", job: "Profesor de asignatura", email1: "fernando.ortiz@university.test", email2: "", phone: "555-0114" },
  { id: "P015", name: "Gabriela Silva", status: "active", career: "Industrial", job: "Profesora de tiempo completo", email1: "gabriela.silva@university.test", email2: "", phone: "555-0115" },
  { id: "P016", name: "Roberto Vega", status: "active", career: "Industrial", job: "Profesor de asignatura", email1: "roberto.vega@university.test", email2: "", phone: "555-0116" },
  { id: "P017", name: "Isabel Romero", status: "active", career: "General", job: "Profesora de tiempo completo", email1: "isabel.romero@university.test", email2: "", phone: "555-0117" },
  { id: "P018", name: "Andrés Pineda", status: "active", career: "General", job: "Profesor de asignatura", email1: "andres.pineda@university.test", email2: "", phone: "555-0118" },
  { id: "P019", name: "Natalia Campos", status: "active", career: "General", job: "Profesora de tiempo completo", email1: "natalia.campos@university.test", email2: "", phone: "555-0119" },
  { id: "P020", name: "Óscar Medina", status: "active", career: "General", job: "Profesor de asignatura", email1: "oscar.medina@university.test", email2: "", phone: "555-0120" },
];

const capabilityCourseIds: Record<string, string[]> = {
  P001: ["SIS1401", "SIS1402", "SIS2401"], P002: ["SIS2403", "SIS2404", "SIS2405"],
  P003: ["CMP2405", "SIS3401", "SIS3402"], P004: ["SIS3407", "SIS3408", "SIS4401"],
  P005: ["ICIV1401", "ICIV1402", "ICIV2401"], P006: ["ICIV2402", "ICIV2403", "ICIV2404"],
  P007: ["ICIV3401", "ICIV3402", "ICIV3403"], P008: ["ICIV4401", "ICIV4402", "ICIV4404"],
  P009: ["IAMB1401", "IAMB2401", "IAMB2402"], P010: ["IAMB3401", "IAMB3402", "IAMB3403"],
  P011: ["IAMB3405", "IAMB3406", "IAMB4404"], P012: ["IAMB4405", "IAMB4406", "IAMB4408"],
  P013: ["IIND2401", "IIND2402", "IIND3401"], P014: ["IIND3403", "IIND3404", "IIND3405"],
  P015: ["IIND3406", "IIND4401", "IIND4402"], P016: ["IIND4403", "IIND4405", "IIND4408"],
  P017: ["MAT1401", "MAT1402", "MAT2401"], P018: ["FIS1401", "FIS1402", "FIS2401"],
  P019: ["ING1401", "ING3401", "ING4401"], P020: ["ADM1401", "EMP1401", "LDR1401"],
};

export const dummyProfessorCourseCapabilities: ProfessorCourseCapabilityRecord[] =
  Object.entries(capabilityCourseIds).flatMap(([professorId, courseIds]) =>
    courseIds.map((courseId, index) => ({
      id: `CAP-${professorId}-${index + 1}`,
      professorId,
      period: PERIOD,
      courseId,
    })),
  );

type AvailabilityWindow = {
  day: WeekDay;
  timeSlotIds: string[];
};

const availabilityWindows: Record<string, AvailabilityWindow[]> = {
  P001: [{ day: "monday", timeSlotIds: ["T1", "T2", "T3", "T4"] }, { day: "wednesday", timeSlotIds: ["T1", "T2", "T3", "T4"] }, { day: "friday", timeSlotIds: ["T1", "T2", "T3"] }],
  P002: [{ day: "tuesday", timeSlotIds: ["T5", "T6", "T7"] }, { day: "thursday", timeSlotIds: ["T5", "T6", "T7"] }],
  P003: [{ day: "monday", timeSlotIds: ["T4", "T5", "T6"] }, { day: "wednesday", timeSlotIds: ["T4", "T5", "T6"] }, { day: "friday", timeSlotIds: ["T4", "T5"] }],
  P004: [{ day: "tuesday", timeSlotIds: ["T7", "T8", "T9"] }, { day: "thursday", timeSlotIds: ["T7", "T8", "T9"] }],
  P005: [{ day: "monday", timeSlotIds: ["T1", "T2", "T3", "T4", "T5"] }, { day: "wednesday", timeSlotIds: ["T1", "T2", "T3", "T4", "T5"] }],
  P006: [{ day: "tuesday", timeSlotIds: ["T3", "T4", "T5"] }, { day: "thursday", timeSlotIds: ["T3", "T4", "T5"] }, { day: "saturday", timeSlotIds: ["T1", "T2"] }],
  P007: [{ day: "monday", timeSlotIds: ["T6", "T7", "T8"] }, { day: "wednesday", timeSlotIds: ["T6", "T7", "T8"] }, { day: "friday", timeSlotIds: ["T6", "T7"] }],
  P008: [{ day: "tuesday", timeSlotIds: ["T8", "T9", "T10"] }, { day: "thursday", timeSlotIds: ["T8", "T9", "T10"] }],
  P009: [{ day: "monday", timeSlotIds: ["T1", "T2", "T3"] }, { day: "wednesday", timeSlotIds: ["T1", "T2", "T3"] }, { day: "friday", timeSlotIds: ["T1", "T2", "T3"] }],
  P010: [{ day: "tuesday", timeSlotIds: ["T4", "T5", "T6"] }, { day: "thursday", timeSlotIds: ["T4", "T5", "T6"] }],
  P011: [{ day: "monday", timeSlotIds: ["T5", "T6", "T7"] }, { day: "wednesday", timeSlotIds: ["T5", "T6", "T7"] }, { day: "friday", timeSlotIds: ["T5", "T6"] }],
  P012: [{ day: "tuesday", timeSlotIds: ["T7", "T8", "T9"] }, { day: "thursday", timeSlotIds: ["T7", "T8", "T9"] },
  ],
  P013: [{ day: "monday", timeSlotIds: ["T2", "T3", "T4"] }, { day: "wednesday", timeSlotIds: ["T2", "T3", "T4"] }, { day: "friday", timeSlotIds: ["T2", "T3"] }],
  P014: [{ day: "tuesday", timeSlotIds: ["T5", "T6", "T7"] }, { day: "thursday", timeSlotIds: ["T5", "T6", "T7"] }],
  P015: [{ day: "monday", timeSlotIds: ["T7", "T8", "T9"] }, { day: "wednesday", timeSlotIds: ["T7", "T8", "T9"] }],
  P016: [{ day: "tuesday", timeSlotIds: ["T8", "T9", "T10"] }, { day: "thursday", timeSlotIds: ["T8", "T9", "T10"] }],
  P017: [{ day: "monday", timeSlotIds: ["T1", "T2", "T3", "T4"] }, { day: "wednesday", timeSlotIds: ["T1", "T2", "T3", "T4"] }, { day: "friday", timeSlotIds: ["T1", "T2"] }],
  P018: [{ day: "tuesday", timeSlotIds: ["T2", "T3", "T4"] }, { day: "thursday", timeSlotIds: ["T2", "T3", "T4"] }, { day: "saturday", timeSlotIds: ["T3", "T4"] }],
  P019: [{ day: "monday", timeSlotIds: ["T5", "T6", "T7"] }, { day: "wednesday", timeSlotIds: ["T5", "T6", "T7"] }, { day: "friday", timeSlotIds: ["T5", "T6"] }],
  P020: [{ day: "tuesday", timeSlotIds: ["T7", "T8", "T9"] }, { day: "thursday", timeSlotIds: ["T7", "T8", "T9"] }],
};

export const dummyProfessorAvailabilities: ProfessorAvailabilityRecord[] =
  Object.entries(availabilityWindows).flatMap(([professorId, windows]) =>
    windows.flatMap(({ day, timeSlotIds }) =>
      timeSlotIds.map((timeSlotId) => ({
        id: `AVL-${professorId}-${day}-${timeSlotId}`,
        professorId,
        period: PERIOD,
        day,
        timeSlotId,
        isAvailable: true,
      })),
    ),
  );
