import { ClassesPageTemplate } from "@/features/class/components/server/ClassesPageTemplate";

export default async function ClassesPage(props: PageProps<"/classes">) {
  await props.params;
  await props.searchParams;
  return <ClassesPageTemplate />;
}
