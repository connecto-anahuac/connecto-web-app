import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import TimeSlot from './TimeSlot'

const meta = {
  title: 'Components/Table/TimeSlot',
  component: TimeSlot,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    state: { control: 'select', options: ['visible', 'highlighted', 'hidden'] },
    label: { control: 'text' },
    startTime: { control: 'text' },
    endTime: { control: 'text' },
    className: { table: { disable: true } },
  },
  args: {
    state: 'visible',
    label: 'T2',
    startTime: '08:30',
    endTime: '10:00',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="bg-Surface p-3">
      <TimeSlot {...args} />
    </div>
  ),
} satisfies Meta<typeof TimeSlot>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}
