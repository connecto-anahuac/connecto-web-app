import { StudentStatus } from "@/shared/types/consts";
import { Period } from "@/shared/types/Period";

export type StudentCollectionItem = {
    studentId: string;
    name: string;
    avatarColorRef: number;
    status: StudentStatus;
    career: string;
    currentSemester: number;
    enrolledPeriod: Period;
    classProgress: number;
    failedClassCount: number;
    contacts: string;
}
