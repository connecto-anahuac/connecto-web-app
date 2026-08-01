import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import DataSection from "./DataSection";
import { DataSearchProvider } from "@/features/search/components/Provider/FilterProvider";

const meta = {
  title: "Components/DataSection",
  component: DataSection,
  parameters: { layout: "padded" },
  render: (args) => (
    <DataSearchProvider>
      <div className="h-96 w-full">
        <DataSection {...args} />
      </div>
    </DataSearchProvider>
  ),
  args: {
    tableConfig: { columns: [] },
    metadata: { optionsByColumnId: {} },
    listDiagram: <div>List view</div>,
    cardDiagram: <div>Grid view</div>,
  },
} satisfies Meta<typeof DataSection>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
