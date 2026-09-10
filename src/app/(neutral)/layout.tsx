import DbInicializer from "@/shared/component/inicializer/DbInicializer";
import Header from "@/shared/component/layout/menu/header/Header";
import { RootNavigationSidebar } from "@/shared/component/layout/menu/sidebar";
import { DataSearchRootProvider } from "@/shared/store/filter/FilterProvider";
// import Header from "@/features/header/components/Header";

export default function NeutralLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <DataSearchRootProvider>
      <div className="relative flex h-full w-full flex-col gap-0 overflow-hidden bg-Surface">
        <DbInicializer />
        <Header className="w-full" />
        <div className="min-h-0 h-full w-full flex-1 flex gap-0">
          <RootNavigationSidebar className="shrink-0" />
          <div className="min-w-0 flex-1 h-full bg-white p-5">{children}</div>
        </div>
      </div>
    </DataSearchRootProvider>
  );
}
