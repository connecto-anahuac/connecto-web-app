import type { ClassroomRecord } from "@/external/domain/university";

const SALON_FLOORS = [1, 2, 3] as const;

export const dummyClassrooms: ClassroomRecord[] = SALON_FLOORS.flatMap((floor) =>
  Array.from({ length: 30 }, (_, index) => {
    const name = `Salon${floor}${String(index + 10).padStart(2, "0")}`;

    return {
      id: name,
      name,
      place: `Edificio ${floor}`,
      note: "",
      equipments: [],
      admin: "",
    };
  }),
);
