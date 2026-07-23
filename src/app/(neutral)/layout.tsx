import DbInicializer from "@/components/inicializer/DbInicializer";
import Header from "@/features/menu/components/header/Header";
import { RootNavigationSidebar } from "@/features/menu/components/sidebar";
// import Header from "@/features/header/components/Header";

export default function NeutralLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex h-full w-full flex-col gap-0 overflow-hidden bg-Surface">
      <DbInicializer />
      <Header className="w-full" />
      <div className="min-h-0 h-full w-full flex-1 flex gap-0">
        <RootNavigationSidebar className="flex-shrink-0" />
        <div className="min-w-0 flex-1 h-full">{children}</div>
      </div>
    </div>
  );
}
