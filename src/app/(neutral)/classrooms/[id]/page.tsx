import { ClassroomPageTemplate } from "@/features/classroom/components/server/ClassroomPageTemplate";

export default async function ClassroomPage({ params }: PageProps<"/classrooms/[id]">) {
  const { id } = await params;
  return <ClassroomPageTemplate classroomId={id} />;
}
