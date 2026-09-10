import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import SortCardFieldChip from './SortCardFieldChip'

const meta = {
  title: 'Components/SortCardFieldChip',
  component: SortCardFieldChip,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    label: { control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    label: 'Nombre',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SortCardFieldChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongLabel: Story = {
  args: {
    label: 'Promedio acumulado ponderado',
  },
}

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Sort field: Nombre' })

    await userEvent.click(button)
    await expect(button).toHaveFocus()
  },
}