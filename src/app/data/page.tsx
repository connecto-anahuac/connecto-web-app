import DataTemplate from "@/features/data/template/DataTemplate";


type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function DataPage({ params }: Props) {
  const { id } = await params;
  return <DataTemplate  />;
}