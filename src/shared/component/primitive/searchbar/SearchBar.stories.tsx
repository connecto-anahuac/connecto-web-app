import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import SearchBar from "./SearchBar";

const suggestions = [
  "Arquitectura de computadoras y la nube",
  "Arquitectura de braa uyuyube 2",
  "Arquitectura del mundo ube alalalal alalala",
];

const meta = {
  title: "Components/Search/SearchBar",
  component: SearchBar,
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  argTypes: {
    state: {
      control: "inline-radio",
      options: ["empty", "writing", "hasDefinedQuery"],
    },
    placeholder: { control: "text" },
    queryText: { control: "text" },
    definedQueryLabel: { control: "text" },
    suggestions: { control: "object" },
    activeSuggestionIndex: { control: "number" },
    className: { table: { disable: true } },
    panelClassName: { table: { disable: true } },
    onClear: { action: "clear" },
    onRemoveDefinedQuery: { action: "remove defined query" },
    onSuggestionClick: { action: "suggestion click" },
  },
  args: {
    state: "empty",
    placeholder: "buscar en los estudiantes",
    queryText: "arquite",
    definedQueryLabel: "arquitectura",
    suggestions,
    activeSuggestionIndex: 0,
    onClear: fn(),
    onRemoveDefinedQuery: fn(),
    onSuggestionClick: fn(),
  },
  tags: ["autodocs"],
  render: (args) => (
    <div className="w-80">
      <SearchBar {...args} />
    </div>
  ),
} satisfies Meta<typeof SearchBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Writing: Story = {
  args: {
    state: "writing",
  },
};

export const HasDefinedQuery: Story = {
  args: {
    state: "hasDefinedQuery",
  },
};

export const InteractiveClear: Story = {
  args: {
    state: "writing",
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Clear search" }));
    await expect(args.onClear).toHaveBeenCalled();
  },
};

export const LongSuggestionList: Story = {
  args: {
    state: "writing",
    activeSuggestionIndex: 2,
    suggestions: [
      "Arquitectura de computadoras y la nube en entornos empresariales complejos",
      "Sistemas distribuidos con observabilidad, resiliencia y despliegues multi-regi\u00f3n",
      "Modelado de datos avanzado para plataformas de b\u00fasqueda acad\u00e9mica y an\u00e1lisis curricular",
    ],
  },
};