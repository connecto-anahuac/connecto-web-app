import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import SelectableBadge from './SelectableBadge'

const meta = {
  title: 'Components/SelectableBadge',
  component: SelectableBadge,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'boolean' },
    removable: { control: 'boolean' },
    removeLabel: { control: 'text' },
    onRemove: { action: 'removed' },
    className: { table: { disable: true } },
  },
  args: {
    label: 'Algorithm',
    selected: false,
    removable: false,
    onRemove: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectableBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: {
    selected: true,
  },
}

export const Removable: Story = {
  args: {
    selected: true,
    removable: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(canvas.getByRole('button', { name: 'Remove Algorithm' }))
    await expect(meta.args.onRemove).toHaveBeenCalled()
  },
}

export const LongLabel: Story = {
  args: {
    label: 'Advanced Databases and Distributed Systems',
    selected: true,
  },
}