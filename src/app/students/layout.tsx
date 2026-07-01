import StudentTemplate from "@/features/student/components/StudentTemplate";
import { StudentsPageTemplate } from "@/features/students/components/StudentsTemplate";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudentPageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  return <StudentsPageTemplate  >
    {children}
  </StudentsPageTemplate>;
}