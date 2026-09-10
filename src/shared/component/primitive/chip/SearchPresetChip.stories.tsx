import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import SearchPresetChip from './SearchPresetChip'

const meta = {
  title: 'Components/Chip/SearchPresetChip',
  component: SearchPresetChip,
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
      <SearchPresetChip {...args} />
    </div>
  ),
} satisfies Meta<typeof SearchPresetChip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Ambiental',
    selected: false,
  },}

export const NumericValue: Story = {
  args: {
    children: 'Ambiental',
    selected: true,
  },
}


export const lLsts: Story = {
  render: () => (
    <div className="flex gap-1">
      <SearchPresetChip selected>
        TIND
      </SearchPresetChip>
      <SearchPresetChip >
        Ambiental
      </SearchPresetChip>
      <SearchPresetChip >
        Industrial
      </SearchPresetChip>
      <SearchPresetChip >
        Civil
      </SearchPresetChip>
    </div>
  ),
}
