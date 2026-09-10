import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import { FilterCard } from './FilterCard'

const meta = {
  title: 'Features/Search/FilterCard',
  component: FilterCard,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    header: { table: { disable: true } },
    trailingAction: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    header: <span className="text-xs leading-none font-medium text-OnSurfaceVariant">Campus</span>,
    children: (
      <div className="rounded-search-filter-inner border border-Outline px-2 py-2 text-sm text-OnSurfaceVariant">
        Filter content
      </div>
    ),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterCard>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Dismissible: Story = {
  args: {
    trailingAction: (
      <button
        type="button"
        aria-label="Close Campus filter"
        className="inline-flex size-search-filter-dismiss items-center justify-center rounded-full border border-transparent text-OnSurfaceVariant"
      >
        x
      </button>
    ),
  },
}

export const LongHeader: Story = {
  args: {
    header: (
      <span className="text-xs leading-none font-medium text-OnSurfaceVariant">
        Advanced placement, campus restrictions, and enrollment status
      </span>
    ),
  },
}

export const Interactive: Story = {
  args: {
    trailingAction: (
      <button
        type="button"
        aria-label="Close Campus filter"
        className="inline-flex size-search-filter-dismiss items-center justify-center rounded-full border border-transparent text-OnSurfaceVariant"
      >
        x
      </button>
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Close Campus filter' })

    await userEvent.click(button)
    await expect(button).toHaveFocus()
  },
}