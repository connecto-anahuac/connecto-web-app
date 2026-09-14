import { ClassroomsPageTemplate } from "@/features/classroom/components/server/ClassroomsPageTemplate";

export default async function ClassroomsPage({ searchParams }: PageProps<"/classrooms">) {
  const { classroomId } = await searchParams;
  return <ClassroomsPageTemplate classroomId={typeof classroomId === "string" && classroomId.trim() ? classroomId : undefined} />;
}
