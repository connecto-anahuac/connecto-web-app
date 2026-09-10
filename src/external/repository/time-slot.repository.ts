import { universityDb } from "@/external/client/university-db";
import type { TimeSlotRecord } from "@/external/domain/university";
export class TimeSlotRepository { findAll(): Promise<TimeSlotRecord[]> { return universityDb.timeSlots.orderBy("position").toArray(); } }
