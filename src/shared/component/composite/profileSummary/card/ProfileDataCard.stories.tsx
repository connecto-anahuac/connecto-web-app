import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import type { ComponentProps } from "react";
import ProfileDataCard from "./ProfileDataCard";

const information: ComponentProps<typeof ProfileDataCard>[] = [
  {
    valueType: "multi",
    iconName: "schoolHat",
    title: "Promedio",
    value: [
      { label: "Global", value: "8.43" },
      { label: "Temporal", value: "8.02" },
    ],
  },
  
  {
    valueType: "multi",
    iconName: "schedule",
    title: "Semestres llevados",
    value: [
      { label: "Total", value: "8" },
      { label: "Regular", value: "5" },
      { label: "Verano", value: "3" },
    ],
  },
  
  {
    valueType: "count",
    iconName: "failedClass",
    title: "Numeros de reprobados",
    value: { current: 3, total: 4, status: "high" },
  },
  
  {
    valueType: "percent",
    iconName: "status",
    title: "Avance",
    value: { value: "78", diff: "+3", status: "low" },
  },
  
  {
    valueType: "count",
    iconName: "schoolHat",
    title: "Requisitos de graduacion",
    value: { current: 1, total: 4, status: "medium" },
  },
  {
    valueType: "warning",
    iconName: "bell",
    title: "Advertencias",
    value: [
      { text: "No ha registrado reingreso en 2 semestres." },
      { text: "No ha llevado PREREQUISITO." },
      { text: "No ha completado REQUISITOS DE GURADUACION." },
    ],
  },
  {
    valueType: "requirement",
    iconName: "curriculum",
    title: "Requisitos de graduación",
    value: [
      { text: "EGEL completado", isCompleted: true },
      { text: "Servicio social pendiente", isCompleted: false },
      { text: "Tesis pendiente", isCompleted: false },
    ],
  },

];

const meta = {
  title: "Components/ProfileSummary/ProfileDataCard",
  component: ProfileDataCard,
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
  args: information[0]!,
  render: () => (
    <div className="grid w-[940px] grid-cols-4 gap-4">
      <div className="col-span-2 grid grid-cols-2 gap-4">
        {information.slice(0, 5).map((props) => (
          <ProfileDataCard key={props.title} {...props} />
        ))}
      </div>
      <div className="col-span-2 flex flex-col gap-4">
        {information.slice(5).map((props) => (
          <ProfileDataCard key={props.title} {...props} />
        ))}
      </div>
    </div>
  ),
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileDataCard>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};
