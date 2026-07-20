import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import Cell from './Cell'

const meta = {
  title: 'Components/Table/Cell',
  component: Cell,
  parameters: {
    layout: 'padded',
    a11y: { test: 'todo' },
  },
  argTypes: {
    children: { control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    children: 'Introduction to Programming',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-72">
      <Cell {...args} />
    </div>
  ),
} satisfies Meta<typeof Cell>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const NumericValue: Story = {
  args: {
    children: '24',
    className: 'justify-end font-medium tabular-nums',
  },
}

export const LongContent: Story = {
  args: {
    children: 'Advanced Database Systems and Distributed Computing Seminar',
  },
}

export const WithCustomContent: Story = {
  args: {
    className: 'py-2',
  },
  render: (args) => (
    <div className="w-80">
      <Cell {...args}>
        <div className="min-w-0">
          <div className="truncate font-medium">Computer Networks</div>
          <div className="truncate text-xs text-OnSurfaceVariant">Room A-204 • Morning block</div>
        </div>
      </Cell>
    </div>
  ),
}