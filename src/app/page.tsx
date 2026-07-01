import CourseKey from "@/components/CourseKey";
import CourseValues from "@/components/CourseValues";
import SemesterBadge from "@/components/SemesterBadge";
import { HomePageTemplate } from "@/features/home/components/server";
import StudentTemplate from "@/features/student/components/StudentTemplate";
import { StudentsPageTemplate } from "@/features/students/components/HomePageTemplate";

export default function Home() {
  // return <HomePageTemplate />;
  // // return <StudentTemplate />;
  // return <StudentsPageTemplate />;
  return <div className="w-full min-h-screen p-4 flex flex-col gap-5 items-center justify-center">
    <CourseKey code={"CMP"} number={"1402"} />
    <SemesterBadge semester={"ene-mayo"} />
    <SemesterBadge semester={"verano"} />
    <SemesterBadge semester={"ago-dec"} />
    <SemesterBadge semester={"semester"} />
    <CourseValues leftValue={"7"} rightValue={"4.5"} />

  </div>
}
