import DbInicializer from "@/shared/component/inicializer/DbInicializer";
import Header from "@/shared/component/layout/menu/header/Header";
import { RootNavigationSidebar } from "@/shared/component/layout/menu/sidebar";
import { ScheduleBuilderSubNavigationSidebar } from "@/shared/component/layout/menu/sidebar/ScheduleBuilderSubNavigationSidebar";
import SubNavigationSidebar from "@/shared/component/layout/menu/sidebar/SubNavigationSidebar";
import { DataSearchRootProvider } from "@/shared/store/filter/FilterProvider";
// import Header from "@/features/header/components/Header";

export default async function NeutralLayout({
  children,
  params,
  // searchParams,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ slug?: string }>;
  // searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  return (
    <DataSearchRootProvider>
      <div className="relative flex h-full w-full flex-col gap-0 overflow-hidden bg-Surface">
        <DbInicializer />
        <Header className="w-full" />
        <div className="min-h-0 h-full w-full flex-1 flex gap-0">
          <RootNavigationSidebar className="shrink-0" />
          <div className="min-w-0 flex-1 h-full bg-white  rounded-lg flex gap-0 mb-2 mr-2">
            {children}
          </div>
        </div>
      </div>
    </DataSearchRootProvider>
  );
}
