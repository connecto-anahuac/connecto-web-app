import { DataSearchProvider } from "@/shared/store/filter/FilterProvider";
import { StudentsPageTemplate } from "@/features/student/components/server/StudentsPageTemplate";

export default function StudentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataSearchProvider scopeId="students:list">
      <StudentsPageTemplate> {children}</StudentsPageTemplate>
    </DataSearchProvider>
  );
}
