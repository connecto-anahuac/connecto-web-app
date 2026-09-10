import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import HeaderCellBase from './HeaderCellBase'

const meta = {
  title: 'Components/Table/HeaderCellBase',
  component: HeaderCellBase,
  parameters: {
    layout: 'padded',
    a11y: { test: 'todo' },
  },
  argTypes: {
    label: { control: 'text' },
    trailing: { table: { disable: true } },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    label: 'Course',
  },
  tags: ['autodocs'],
  render: (args) => (
    <div className="w-72">
      <HeaderCellBase {...args} />
    </div>
  ),
} satisfies Meta<typeof HeaderCellBase>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const WithTrailing: Story = {
  args: {
    label: 'Credits',
    trailing: <span aria-hidden="true">DESC</span>,
  },
}

export const LongLabel: Story = {
  args: {
    label: 'Advanced Databases and Distributed Systems Requirements',
  },
}

export const WithCustomChildren: Story = {
  args: {
    label: 'Ignored by children',
    children: <span className="font-semibold text-OnSurface">Custom header content</span>,
  },
}