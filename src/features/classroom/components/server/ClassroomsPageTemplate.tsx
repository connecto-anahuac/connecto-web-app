import { ClassroomCollection } from "../client/ClassroomCollection";

export function ClassroomsPageTemplate({ classroomId }: { classroomId?: string }) {
  return <ClassroomCollection activeId={classroomId} />;
}
