import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, within } from "storybook/test";

import SearchResultPanel from "./SearchResultPanel";

const suggestions = [
  "Arquitectura de computadoras y la nube",
  "Arquitectura de braa uyuyube 2",
  "Arquitectura del mundo ube alalalal alalala",
];

const meta = {
  title: "Components/Search/SearchResultPanel",
  component: SearchResultPanel,
  parameters: {
    layout: "centered",
    a11y: { test: "todo" },
  },
  argTypes: {
    suggestions: { control: "object" },
    activeIndex: { control: "number" },
    className: { table: { disable: true } },
    onSuggestionClick: { action: "suggestion click" },
  },
  args: {
    suggestions,
    activeIndex: 0,
    onSuggestionClick: fn(),
  },
  tags: ["autodocs"],
  render: (args) => (
    <div className="w-80">
      <SearchResultPanel {...args} />
    </div>
  ),
} satisfies Meta<typeof SearchResultPanel>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithSecondItemActive: Story = {
  args: {
    activeIndex: 1,
  },
};

export const LongSuggestions: Story = {
  args: {
    activeIndex: 2,
    suggestions: [
      "Arquitectura de computadoras y la nube en entornos empresariales complejos",
      "Sistemas distribuidos con observabilidad, resiliencia y despliegues multi-region",
      "Modelado de datos avanzado para plataformas de busqueda academica y analisis curricular",
    ],
  },
};

export const ClickSuggestion: Story = {
  args: {
    activeIndex: 1,
  },
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: suggestions[1] }));
    await expect(args.onSuggestionClick).toHaveBeenCalledWith(suggestions[1], 1);
  },
};

export const EmptyState: Story = {
  args: {
    suggestions: [],
    activeIndex: undefined,
  },
};