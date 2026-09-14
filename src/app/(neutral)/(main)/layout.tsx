import DbInicializer from "@/shared/component/inicializer/DbInicializer";
import Header from "@/shared/component/layout/menu/header/Header";
import { RootNavigationSidebar } from "@/shared/component/layout/menu/sidebar";
import { ScheduleBuilderSubNavigationSidebar } from "@/shared/component/layout/menu/sidebar/ScheduleBuilderSubNavigationSidebar";
import SubNavigationSidebar from "@/shared/component/layout/menu/sidebar/SubNavigationSidebar";
import { DataSearchRootProvider } from "@/shared/store/filter/FilterProvider";
// import Header from "@/features/header/components/Header";

export default async function NeutralMainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="w-full h-full p-5">{children}</div>;
}
