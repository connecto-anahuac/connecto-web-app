import { StudentsPageTemplate } from "@/features/students/components/server/StudentsPageTemplate";

export default function StudentsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <StudentsPageTemplate>{children}</StudentsPageTemplate>;
}