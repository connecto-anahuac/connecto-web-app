import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import TabBadge from './TabBadge'
import SelectBoxFill from './SelectBoxFill'
import { Icons } from './icon'

const meta = {
  title: 'Components/SelectBoxFill',
  component: SelectBoxFill,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    value: { control: 'text' },
    size: { control: 'select', options: ['small', 'middle'] },
    leadingIcon: {control: 'select', options: Object.keys(Icons)},
    className: { table: { disable: true } },
    labelClassName: { table: { disable: true } },
    triggerClassName: { table: { disable: true } },
  },
  args: {
    value: 'Periodo 2026-1',
    size: 'small',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectBoxFill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Middle: Story = {
  args: {
    size: 'middle',
  },
}

export const WithLeadingIcon: Story = {
  args: {
    leadingIcon: "admin",
  },
}

export const InteractiveTrigger: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: 'Periodo 2026-1 options' })

    await userEvent.click(trigger)
    await expect(trigger).toHaveFocus()
  },
}