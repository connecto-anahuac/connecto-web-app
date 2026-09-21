import { z } from "zod";

const weekDaySchema = z.enum([
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
]);

export const scheduleBuilderDataSchema = z.object({
  career: z.string(),
  period: z.string(),
  offeringCourses: z.array(z.object({
    id: z.string(),
    courseKey: z.string(),
    sessionNumber: z.number().int().min(1),
    estimatedNumber: z.number(),
    course: z.object({
      key: z.string(),
      keyCode: z.string(),
      keyNumber: z.string(),
      name: z.string(),
      hours: z.number(),
      credits: z.number(),
      block: z.string(),
      recommendedSemesters: z.array(z.number().int()),
    }),
  })),
  professors: z.array(z.object({
    id: z.string(),
    name: z.string(),
    status: z.string(),
    career: z.string(),
    courseCapabilities: z.array(z.string()),
    availability: z.array(z.object({
      day: weekDaySchema,
      timeSlotId: z.string(),
      isAvailable: z.boolean(),
    })),
  })),
  classrooms: z.array(z.object({
    id: z.string(),
    name: z.string(),
    place: z.string(),
    note: z.string(),
    equipments: z.array(z.string()),
    admin: z.string(),
  })),
  timeSlots: z.array(z.object({
    id: z.string(),
    startTime: z.string(),
    endTime: z.string(),
    position: z.number(),
  })),
});

export type ScheduleBuilderDataDto = z.infer<typeof scheduleBuilderDataSchema>;
export type ScheduleBuilderProfessorDto = ScheduleBuilderDataDto["professors"][number];

export function ensureScheduleBuilderDataDto(value: unknown): ScheduleBuilderDataDto {
  return scheduleBuilderDataSchema.parse(value);
}
