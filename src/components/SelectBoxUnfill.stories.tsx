import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import SelectBoxUnfill from './SelectBoxUnfill'

const meta = {
  title: 'Components/SelectBoxUnfill',
  component: SelectBoxUnfill,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    label: { control: 'text' },
    icon: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    label: 'contiene',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectBoxUnfill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const CustomLabel: Story = {
  args: {
    label: 'empieza con',
  },
}

export const CustomIcon: Story = {
  args: {
    icon: (
      <span aria-hidden="true" className="inline-flex size-4 items-center justify-center text-connecto-muted-strong">
        +
      </span>
    ),
  },
}

export const LongLabel: Story = {
  args: {
    label: 'coincide parcialmente con el criterio',
  },
}