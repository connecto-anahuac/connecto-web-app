import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import SortCardSortBadge from './SortCardSortBadge'

const meta = {
  title: 'Components/SortCardSortBadge',
  component: SortCardSortBadge,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    className: { table: { disable: true } },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SortCardSortBadge>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Emphasized: Story = {
  args: {
    className: 'bg-connecto-surface text-connecto-ink',
  },
}