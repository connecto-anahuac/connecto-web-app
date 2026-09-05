import { Period } from "@/shared/types/Period";

export type StudentCollectionItem = {
    studentId: string;
    name: string;
    status: string;
    career: string;
    currentSemester: number;
    enrolledPeriod: Period;
    classProgress: number;
    failedClassCount: number;
    contacts: string;
}