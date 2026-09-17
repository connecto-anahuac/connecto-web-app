
import SubNavigationSidebar, {
  NavigationEntry,
} from "@/shared/component/layout/menu/sidebar/SubNavigationSidebar";
import { DataSearchRootProvider } from "@/shared/store/filter/FilterProvider";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Schedule Builder | Connecto",
  description: "Construye y valida el horario académico por periodo.",
};

const SUB_NAVIGATION_ITEMS: NavigationEntry[] = [
  {
    label: "offering course",
    icon: "class",
    href: "/schedule-builder/offering-course",
  },
  // { label: "profesores", icon: "professor", href: "/professors" },
  // { label: "Materias", icon: "class", href: "/classes" },
  // { label: "Aulas", icon: "door", href: "/classrooms" },
  {
    label: "Schedule builder",
    icon: "schedule",
    href: "/schedule-builder/builder",
  },
];
export default function ScheduleBuilderLayout(
  props: LayoutProps<"/schedule-builder">,
) {
  return (
    <DataSearchRootProvider>
      <div className="w-full h-full flex gap-0">
        <SubNavigationSidebar
          title="Schedule builder"
          navigationEntries={SUB_NAVIGATION_ITEMS}
        />
        <div className="flex-1 h-full p-1 pl-0 min-w-0">{props.children}</div>
      </div>
    </DataSearchRootProvider>
  );
}
