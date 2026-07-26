import { FilterProvider } from "@/features/search/components/Provider/FilterProvider";

export default function StudentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <FilterProvider>
      {children}
    </FilterProvider>
  );
}