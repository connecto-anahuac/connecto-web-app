import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

import MultiSelect from './MultiSelect'

const meta = {
  title: 'Components/MultiSelect',
  component: MultiSelect,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    label: { control: 'text' },
    checked: { control: 'boolean' },
    isHovered: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'clicked' },
    className: { table: { disable: true } },
    checkboxClassName: { table: { disable: true } },
    type: { table: { disable: true } },
  },
  args: {
    label: 'Industrial',
    checked: false,
    isHovered: false,
    disabled: false,
    onClick: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MultiSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = {
  args: {
    checked: true,
  },
}

export const Hovered: Story = {
  args: {
    isHovered: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const LongLabel: Story = {
  args: {
    checked: true,
    label: 'Advanced Databases and Distributed Systems',
  },
}

export const Interactive: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const checkbox = canvas.getByRole('checkbox', { name: 'Industrial' })

    await userEvent.click(checkbox)
    await expect(args.onClick).toHaveBeenCalled()
    await expect(checkbox).toHaveAttribute('aria-checked', 'false')
  },
}