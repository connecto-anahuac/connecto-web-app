import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import Column from './Column'

const meta = {
  title: 'Components/Table/Column',
  component: Column,
  parameters: {
    layout: 'padded',
    a11y: { test: 'todo' },
  },
  argTypes: {
    children: { control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    children: 'Course title',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-72 rounded-lg border border-Outline/80 bg-Surface p-3">
      <Column {...args} />
    </div>
  ),
} satisfies Meta<typeof Column>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithSupportingText: Story = {
  args: {
    className: 'gap-1',
  },
  render: (args) => (
    <div className="w-72 rounded-lg border border-Outline/80 bg-Surface p-3">
      <Column {...args}>
        <span className="text-sm font-medium text-OnSurface">Introduction to Programming</span>
        <span className="text-xs text-OnSurfaceVariant">Required course for first-year students</span>
      </Column>
    </div>
  ),
}

export const LongContent: Story = {
  args: {
    className: 'w-full gap-1',
  },
  render: (args) => (
    <div className="w-72 rounded-lg border border-Outline/80 bg-Surface p-3">
      <Column {...args}>
        <span className="truncate text-sm font-medium text-OnSurface">
          Advanced Databases and Distributed Systems Seminar With Cross-Listed Research Topics
        </span>
        <span className="truncate text-xs text-OnSurfaceVariant">
          Demonstrates how the column keeps stacked content within a constrained table width
        </span>
      </Column>
    </div>
  ),
}

export const SpacedItems: Story = {
  args: {
    className: 'gap-2 rounded-md bg-SurfaceContainerLow p-2',
  },
  render: (args) => (
    <div className="w-72 rounded-lg border border-Outline/80 bg-Surface p-3">
      <Column {...args}>
        <span className="text-xs uppercase tracking-wide text-OnSurfaceVariant">Schedule</span>
        <span className="text-sm text-OnSurface">Mon/Wed 09:00 - 10:30</span>
        <span className="text-sm text-OnSurface">Room B-204</span>
      </Column>
    </div>
  ),
}