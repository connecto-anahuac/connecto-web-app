import { DataSearchProvider } from "@/shared/store/filter/FilterProvider";

export default function StudentsLayout({
  children,
}: LayoutProps<"/students">) {
  return (
    <DataSearchProvider scopeId="students:list">
      {children}
    </DataSearchProvider>
  );
}
