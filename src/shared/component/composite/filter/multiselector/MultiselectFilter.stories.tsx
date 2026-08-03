import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";
import { MultiSelectFilter } from "./MultiselectFilter";

const column = {
  fieldId: "career",
  label: "Carrera",
  valueType: "enum" as const,
  icon: "person" as const,
  accessor: () => null,
  format: () => "",
};

const meta = {
  title: "Features/Search/MultiselectFilter",
  component: MultiSelectFilter,
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  args: {
    column,
    operator: "in",
    options: [
      { label: "Ingenieria", value: "engineering", searchTexts: [] },
      { label: "Derecho", value: "law", searchTexts: [] },
      { label: "Diseno", value: "design", searchTexts: [] },
    ],
    values: [],
    onClose: () => undefined,
    onOperatorChange: () => undefined,
    onValueChange: fn(),
  },
  tags: ["autodocs"],
} satisfies Meta<typeof MultiSelectFilter<unknown>>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const LongOptions: Story = {
  args: {
    options: [
      {
        label: "Ingenieria en Sistemas Computacionales Avanzados",
        value: "systems",
        searchTexts: [],
      },
      {
        label: "Administracion y Direccion Estrategica de Empresas",
        value: "business",
        searchTexts: [],
      },
    ],
  },
};

export const SelectedValues: Story = {
  args: {
    values: ["engineering", "law"],
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Remove Ingenieria" }),
    );
    await expect(args.onValueChange).toHaveBeenCalledWith(["law"]);
  },
};

export const EmptyOptions: Story = {
  args: { options: [] },
};
