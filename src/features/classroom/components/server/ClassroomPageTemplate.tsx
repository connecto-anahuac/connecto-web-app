import { ClassroomDetail } from "../client/ClassroomDetail";

export function ClassroomPageTemplate({ classroomId }: { classroomId: string }) {
  return <ClassroomDetail classroomId={classroomId} />;
}
