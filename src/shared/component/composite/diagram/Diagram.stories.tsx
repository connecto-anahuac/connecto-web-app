import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import ColumnTitle from "./ColumnTitle";
import { Diagram } from "./Diagram";
import RowTitle from "./RowTitle";

const meta = {
  title: "Components/Diagram/Diagram",
  component: Diagram,
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Diagram>;

export default meta;
type Story = StoryObj<typeof meta>;

const columns = ["Semester 1", "Semester 2", "Semester 3"];
const rows = ["A", "B", "C"];

function ExampleContent() {
  return (
    <>
      <Diagram.Content x={1} y={1}>
        <div className="rounded-sm bg-PrimaryContainerLow p-4 text-sm">
          Content 1–1
        </div>
      </Diagram.Content>
      <Diagram.Content x={2} y={2}>
        <div className="rounded-sm bg-DividerMiddle p-4 text-sm">
          Content 2–2
        </div>
      </Diagram.Content>
    </>
  );
}

export const AutoCount: Story = {
  render: () => (
    <div className="max-w-180 overflow-auto p-2">
      <Diagram className="w-fit">
        <Diagram.Columns>
          {columns.map((column) => (
            <ColumnTitle key={column} text={column} />
          ))}
        </Diagram.Columns>
        <Diagram.Rows>
          {rows.map((row) => (
            <RowTitle key={row} text={row} />
          ))}
        </Diagram.Rows>
        <ExampleContent />
      </Diagram>
    </div>
  ),
};

export const ExplicitCount: Story = {
  render: () => (
    <div className="max-w-180 overflow-auto p-2">
      <Diagram
        columnCount={4}
        rowCount={4}
        columnWidth="10rem"
        gap="0.5rem"
        className="w-fit"
      >
        <Diagram.Columns>
          <ColumnTitle text="Column 1" />
          <ColumnTitle text="Column 2" />
        </Diagram.Columns>
        <Diagram.Rows>
          <RowTitle text="1" />
          <RowTitle text="2" />
        </Diagram.Rows>
        <ExampleContent />
      </Diagram>
    </div>
  ),
};
