import { DataSearchProvider } from "@/features/search/components/Provider/FilterProvider";
import { StudentsPageTemplate } from "@/features/students/components/server/StudentsPageTemplate";

export default function StudentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataSearchProvider>
      <StudentsPageTemplate> {children}</StudentsPageTemplate>
    </DataSearchProvider>
  );
}
