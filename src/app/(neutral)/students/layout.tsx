import { FilterProvider } from "@/features/search/components/Provider/FilterProvider";
import { StudentsPageTemplate } from "@/features/students/components/server/StudentsPageTemplate";

export default function StudentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <FilterProvider>
      <StudentsPageTemplate> {children}</StudentsPageTemplate>
    </FilterProvider>
  );
}
