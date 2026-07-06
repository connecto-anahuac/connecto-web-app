import Diagram from "@/features/offeringCourse/components/Diagram";
import OfferingClassCardView from "@/features/offeringCourse/components/OfferingClassCardView";
import type { OfferingCourse } from "@/features/offeringCourse/types/offering-course";

type Props = {
  career: string;
  error: string | null;
  loading: boolean;
  offeringCourses: OfferingCourse[];
  pendingCourseKeys: string[];
  selectedCourseKeys: string[];
  onToggle: (offeringCourse: OfferingCourse) => Promise<void>;
};

export function ScheduleBuilderPresenter({
  career,
  error,
  loading,
  offeringCourses,
  pendingCourseKeys,
  selectedCourseKeys,
  onToggle,
}: Props) {
  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (offeringCourses.length === 0) {
    return <div>No courses found for {career}</div>;
  }

  const maxSemester = Math.max(...offeringCourses.map((item) => item.semester), 1);
  const maxPosition = Math.max(...offeringCourses.map((item) => item.position), 1) + 1;

  return (
    <div className="h-full w-full overflow-auto p-2.5">
      <Diagram maxSemester={maxSemester} maxPosition={maxPosition}>
        {offeringCourses.map((offeringCourse) => (
          <div
            key={`${offeringCourse.key}-${offeringCourse.semester}-${offeringCourse.position}`}
            style={{
              gridColumnStart: offeringCourse.semester + 1 || 2,
              gridRowStart: offeringCourse.position + 2 || 2,
            }}
          >
            <OfferingClassCardView
              offeringClass={offeringCourse}
              className="w-full"
              isSelected={selectedCourseKeys.includes(offeringCourse.key)}
              isPending={pendingCourseKeys.includes(offeringCourse.key)}
              onToggle={() => void onToggle(offeringCourse)}
            />
          </div>
        ))}
      </Diagram>
    </div>
  );
}