import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import TabBadge from './TabBadge'

const meta = {
  title: 'Components/TabBadge',
  component: TabBadge,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    label: { control: 'text' },
    selected: { control: 'boolean' },
    icon: { table: { disable: true } },
    showDot: { control: 'boolean' },
    className: { table: { disable: true } },
    onClick: { action: 'clicked' },
  },
  args: {
    label: 'Todos',
    selected: false,
    showDot: false,
    onClick: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof TabBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Selected: Story = {
  args: {
    selected: true,
  },
}

export const WithDot: Story = {
  args: {
    showDot: true,
  },
}

export const WithIcon: Story = {
  args: {
    icon: (
      <span aria-hidden="true" className="inline-flex size-4 items-center justify-center rounded-full border border-current text-[10px]">
        3
      </span>
    ),
    selected: true,
  },
}

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Todos' })

    await userEvent.click(button)
    await expect(meta.args.onClick).toHaveBeenCalled()
  },
}