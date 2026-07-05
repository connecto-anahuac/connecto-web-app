import DbInicializer from "@/components/inicializer/DbInicializer";
import Header from "@/features/header/components/Header";

export default function NeutralLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex h-full w-full flex-col gap-0 overflow-hidden bg-Surface">
      <DbInicializer />
      <Header className="w-full" />
      <div className="min-h-0 h-full w-full flex-1">{children}</div>
    </div>
  );
}