import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import SortCard from './SortCard'

const meta = {
  title: 'Components/SortCard',
  component: SortCard,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    fieldLabel: { control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    fieldLabel: 'Nombre',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SortCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongFieldLabel: Story = {
  args: {
    fieldLabel: 'Promedio acumulado ponderado',
  },
}

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const reorderButton = canvas.getByRole('button', { name: 'Reorder sort rule' })
    const removeButton = canvas.getByRole('button', { name: 'Remove sort rule' })

    await userEvent.click(reorderButton)
    await expect(reorderButton).toHaveFocus()
    await userEvent.click(removeButton)
    await expect(removeButton).toHaveFocus()
  },
}