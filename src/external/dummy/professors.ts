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
  { id: "P021", name: "Beatriz Acosta", status: "active", career: "General", job: "Profesora de tiempo completo", email1: "beatriz.acosta@university.test", email2: "", phone: "555-0121" },
  { id: "P022", name: "Daniela Rios", status: "active", career: "General", job: "Profesora de asignatura", email1: "daniela.rios@university.test", email2: "", phone: "555-0122" },
  { id: "P023", name: "Emilio Cabrera", status: "active", career: "Ambiental", job: "Profesor de tiempo completo", email1: "emilio.cabrera@university.test", email2: "", phone: "555-0123" },
  { id: "P024", name: "Teresa Nunez", status: "active", career: "General", job: "Profesora de asignatura", email1: "teresa.nunez@university.test", email2: "", phone: "555-0124" },
  { id: "P025", name: "Ramon Solis", status: "active", career: "General", job: "Profesor de tiempo completo", email1: "ramon.solis@university.test", email2: "", phone: "555-0125" },
  { id: "P026", name: "Claudia Mendez", status: "active", career: "Ambiental", job: "Profesora de asignatura", email1: "claudia.mendez@university.test", email2: "", phone: "555-0126" },
  { id: "P027", name: "Victor Ibarra", status: "active", career: "Civil", job: "Profesor de tiempo completo", email1: "victor.ibarra@university.test", email2: "", phone: "555-0127" },
  { id: "P028", name: "Lucia Peralta", status: "active", career: "Civil", job: "Profesora de asignatura", email1: "lucia.peralta@university.test", email2: "", phone: "555-0128" },
  { id: "P029", name: "Sergio Luna", status: "active", career: "Civil", job: "Profesor de tiempo completo", email1: "sergio.luna@university.test", email2: "", phone: "555-0129" },
  { id: "P030", name: "Monica Padilla", status: "active", career: "Civil", job: "Profesora de asignatura", email1: "monica.padilla@university.test", email2: "", phone: "555-0130" },
  { id: "P031", name: "Alberto Rangel", status: "active", career: "Civil", job: "Profesor de tiempo completo", email1: "alberto.rangel@university.test", email2: "", phone: "555-0131" },
  { id: "P032", name: "Noemi Valencia", status: "active", career: "Civil", job: "Profesora de asignatura", email1: "noemi.valencia@university.test", email2: "", phone: "555-0132" },
  { id: "P033", name: "Cesar Lozano", status: "active", career: "Industrial", job: "Profesor de tiempo completo", email1: "cesar.lozano@university.test", email2: "", phone: "555-0133" },
  { id: "P034", name: "Irene Bravo", status: "active", career: "Mecanica", job: "Profesora de asignatura", email1: "irene.bravo@university.test", email2: "", phone: "555-0134" },
  { id: "P035", name: "Gustavo Arias", status: "active", career: "Mecanica", job: "Profesor de tiempo completo", email1: "gustavo.arias@university.test", email2: "", phone: "555-0135" },
  { id: "P036", name: "Adriana Cantu", status: "active", career: "Industrial", job: "Profesora de asignatura", email1: "adriana.cantu@university.test", email2: "", phone: "555-0136" },
  { id: "P037", name: "Felipe Rosas", status: "active", career: "Industrial", job: "Profesor de tiempo completo", email1: "felipe.rosas@university.test", email2: "", phone: "555-0137" },
  { id: "P038", name: "Veronica Leon", status: "active", career: "General", job: "Profesora de asignatura", email1: "veronica.leon@university.test", email2: "", phone: "555-0138" },
  { id: "P039", name: "Hugo Beltran", status: "active", career: "General", job: "Profesor de tiempo completo", email1: "hugo.beltran@university.test", email2: "", phone: "555-0139" },
  { id: "P040", name: "Paola Arce", status: "active", career: "General", job: "Profesora de asignatura", email1: "paola.arce@university.test", email2: "", phone: "555-0140" },
  { id: "P041", name: "Marco Varela", status: "active", career: "General", job: "Profesor de tiempo completo", email1: "marco.varela@university.test", email2: "", phone: "555-0141" },
  { id: "P042", name: "Silvia Correa", status: "active", career: "General", job: "Profesora de asignatura", email1: "silvia.correa@university.test", email2: "", phone: "555-0142" },
  { id: "P043", name: "Julio Trevino", status: "active", career: "General", job: "Profesor de tiempo completo", email1: "julio.trevino@university.test", email2: "", phone: "555-0143" },
  { id: "P044", name: "Rosa Villalobos", status: "active", career: "General", job: "Profesora de asignatura", email1: "rosa.villalobos@university.test", email2: "", phone: "555-0144" },
  { id: "P045", name: "Manuel Cedillo", status: "active", career: "General", job: "Profesor de tiempo completo", email1: "manuel.cedillo@university.test", email2: "", phone: "555-0145" },
  { id: "P046", name: "Karina Ochoa", status: "active", career: "General", job: "Profesora de asignatura", email1: "karina.ochoa@university.test", email2: "", phone: "555-0146" },
  { id: "P047", name: "Eduardo Sosa", status: "active", career: "TIND", job: "Profesor de tiempo completo", email1: "eduardo.sosa@university.test", email2: "", phone: "555-0147" },
  { id: "P048", name: "Alejandra Galvan", status: "active", career: "TIND", job: "Profesora de asignatura", email1: "alejandra.galvan@university.test", email2: "", phone: "555-0148" },
  { id: "P049", name: "Nicolas Estrada", status: "active", career: "TIND", job: "Profesor de tiempo completo", email1: "nicolas.estrada@university.test", email2: "", phone: "555-0149" },
  { id: "P050", name: "Marta Quezada", status: "active", career: "TIND", job: "Profesora de asignatura", email1: "marta.quezada@university.test", email2: "", phone: "555-0150" },
  { id: "P051", name: "Raul Zamora", status: "active", career: "General", job: "Profesor de tiempo completo", email1: "raul.zamora@university.test", email2: "", phone: "555-0151" },
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
  P021: ["ADM2402", "ADM4404", "CON2402"], P022: ["CUL1411", "CUL1412", "DER4414"],
  P023: ["ECOL1401", "ECOL4401", "ECOL4402"], P024: ["EMP1402", "FIS2402", "FIS2403"],
  P025: ["HUM1401", "HUM1402", "HUM1403"], P026: ["HUM1404", "HUM1405", "IAMB3407"],
  P027: ["IAMB3408", "IAMB4409", "IAMB4411"], P028: ["ICIV1403", "ICIV1404", "ICIV2405"],
  P029: ["ICIV3404", "ICIV3405", "ICIV3406"], P030: ["ICIV3407", "ICIV3408", "ICIV3409"],
  P031: ["ICIV3410", "ICIV4403", "ICIV4405"], P032: ["ICIV4406", "ICIV4407", "ICIV4408"],
  P033: ["ICIV4410", "ICIV4412", "ICIV4416"], P034: ["IELC1401", "IIND4409", "IIND4410"],
  P035: ["IIND4411", "IIND4415", "IIND4417"], P036: ["IIND4418", "IMEC1401", "IMEC1402"],
  P037: ["IMEC2403", "IMEC2404", "IMEC3409"], P038: ["IND3402", "INT4405", "INT4406"],
  P039: ["INT4407", "INT4408", "INT4453"], P040: ["INT4454", "INT4455", "INT4456"],
  P041: ["INT4457", "LDR2401", "MAT0403"], P042: ["MAT1403", "MAT1404", "MAT1415"],
  P043: ["MAT2402", "MAT2403", "MAT2404"], P044: ["MAT3402", "QUI1401", "QUI2401"],
  P045: ["QUI2404", "QUI2407", "QUI2410"], P046: ["QUI3401", "QUI3402", "QUI3405"],
  P047: ["QUI4407", "SIS2406", "SIS3403"], P048: ["SIS3404", "SIS3409", "SIS3410"],
  P049: ["SIS4402", "SIS4403", "SIS4404"], P050: ["SIS4407", "SIS4409", "SIS4410"],
  P051: ["SIS4411", "SIS4415", "SOC3401"],
};

const capabilityProfessorIds = Object.keys(capabilityCourseIds);

export const dummyProfessorCourseCapabilities: ProfessorCourseCapabilityRecord[] =
  Object.entries(capabilityCourseIds).flatMap(([professorId, courseIds], professorIndex) => {
    const alternateProfessorId = capabilityProfessorIds[
      (professorIndex + 1) % capabilityProfessorIds.length
    ];

    return [
      ...courseIds.map((courseId, index) => ({
        id: `CAP-${professorId}-${index + 1}`,
        professorId,
        period: PERIOD,
        courseId,
      })),
      ...courseIds.map((courseId, index) => ({
        id: `CAP-${alternateProfessorId}-${index + 4}`,
        professorId: alternateProfessorId,
        period: PERIOD,
        courseId,
      })),
    ];
  });

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
  dummyProfessors.flatMap(({ id: professorId }, professorIndex) => {
    const windows = availabilityWindows[professorId] ?? (professorIndex % 2 === 0
      ? [{ day: "monday" as const, timeSlotIds: ["T2", "T3", "T4"] }, { day: "wednesday" as const, timeSlotIds: ["T2", "T3", "T4"] }]
      : [{ day: "tuesday" as const, timeSlotIds: ["T5", "T6", "T7"] }, { day: "thursday" as const, timeSlotIds: ["T5", "T6", "T7"] }]);

    return windows.flatMap(({ day, timeSlotIds }) =>
      timeSlotIds.map((timeSlotId) => ({
        id: `AVL-${professorId}-${day}-${timeSlotId}`,
        professorId,
        period: PERIOD,
        day,
        timeSlotId,
        isAvailable: true,
      })),
    );
  });
