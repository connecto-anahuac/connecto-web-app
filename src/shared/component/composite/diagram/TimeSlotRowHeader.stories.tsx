import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import TimeSlotRowHeader from './TimeSlotRowHeader'

const meta = {
  title: 'Components/Table/TimeSlotRowHeader',
  component: TimeSlotRowHeader,
  parameters: {
    layout: 'padded',
    a11y: { test: 'todo' },
  },
  argTypes: {
    state: { control: 'select', options: ['visible', 'highlighted', 'hidden'] },
    label: { control: 'text' },
    startTime: { control: 'text' },
    endTime: { control: 'text' },
    className: { table: { disable: true } },
    children: { table: { disable: true } },
  },
  args: {
    state: 'visible',
    label: 'T2',
    startTime: '08:30',
    endTime: '10:00',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="inline-flex rounded-md bg-Surface p-3">
      <TimeSlotRowHeader {...args} />
    </div>
  ),
} satisfies Meta<typeof TimeSlotRowHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Highlighted: Story = {
  args: {
    state: 'highlighted',
    label: 'T3',
    startTime: '10:15',
    endTime: '11:45',
  },
}

export const Hidden: Story = {
  args: {
    state: 'hidden',
    label: 'T4',
    startTime: '13:00',
    endTime: '14:30',
  },
}