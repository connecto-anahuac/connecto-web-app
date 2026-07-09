import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import OfferingCourseSemesterRow from './OfferingCourseSemesterRow'

const meta = {
  title: 'Features/OfferingCourse/OfferingCourseSemesterRow',
  component: OfferingCourseSemesterRow,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    semesterLabel: { control: 'text' },
    periodLabel: { control: 'text' },
    yearLabel: { control: 'text' },
    studentCount: { control: 'number' },
    showLeadingArrow: { control: 'boolean' },
    onAdd: { action: 'clicked' },
    className: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    semesterLabel: '2026-1',
    periodLabel: 'Regular',
    yearLabel: '2026',
    studentCount: 24,
    showLeadingArrow: true,
    onAdd: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OfferingCourseSemesterRow>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithoutLeadingArrow: Story = {
  args: {
    showLeadingArrow: false,
  },
}

export const LongLabels: Story = {
  args: {
    semesterLabel: 'Intersemestral de Investigacion Aplicada',
    periodLabel: 'Matricula extraordinaria extendida',
    yearLabel: 'Ano academico 2026-2027',
    studentCount: 128,
  },
}

export const InteractiveAdd: Story = {
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Add 2026-1' })

    await userEvent.click(button)
    await expect(args.onAdd).toHaveBeenCalled()
  },
}