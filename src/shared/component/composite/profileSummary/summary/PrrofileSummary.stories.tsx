import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { StudentStatus } from "@/shared/types/consts";
import ProfileSummary, { type Informations } from "./ProfileSummary";

const infomations: Informations = {
  id: {
    iconName: "hashmark",
    label: "Matricula",
    value: "00392460",
  },
  name: {
    iconName: "person",
    label: "Nombre",
    value: "Ryan Garcia Ximenez",
  },
  career: {
    iconName: "frascoOutline",
    label: "Carrera",
    value: "TIND",
  },
  semester: {
    iconName: "schedule",
    label: "Semestre",
    value: "5",
  },
  enrolledPeriod: {
    iconName: "schedule",
    label: "Periodo ingresado",
    value: "202460",
  },
  nationality: {
    iconName: "twoPersons",
    label: "Nacionalidad",
    value: "Mexicana",
  },
  schoolMail: {
    iconName: "schoolEmail",
    label: "Correo escolar",
    value: "ryan.0101@anahuac.mx",
  },
  personalMail: {
    iconName: "email",
    label: "Correo personal",
    value: "ryan.garcia@gmail.com",
  },
  phone: {
    iconName: "whatsapp",
    label: "Celular",
    value: "+1 090-1832-6940",
  },
};

const meta = {
  title: "Components/ProfileSummary/ProfileSummary",
  component: ProfileSummary,
  parameters: {
    layout: "padded",
    a11y: { test: "todo" },
  },
  args: {
    infomations,
    imgSrc: "/data/avator.png",
    status: StudentStatus.ACTIVE,
    planTotalSemesters: 9,
  },
  argTypes: {
    status: {
      control: "select",
      options: Object.values(StudentStatus),
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof ProfileSummary>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};

export const Inactive: Story = {
  args: {
    status: StudentStatus.INACTIVE,
  },
};
