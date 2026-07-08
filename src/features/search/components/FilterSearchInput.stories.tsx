import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import { FilterSearchInput } from './FilterSearchInput'

const meta = {
  title: 'Features/Search/FilterSearchInput',
  component: FilterSearchInput,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    placeholder: { control: 'text' },
    defaultValue: { control: 'text' },
    disabled: { control: 'boolean' },
    className: { table: { disable: true } },
    onChange: { action: 'changed' },
  },
  args: {
    placeholder: 'Search filters',
    defaultValue: 'Ing',
    'aria-label': 'Search filters',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FilterSearchInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Empty: Story = {
  args: {
    defaultValue: '',
    placeholder: 'Type to search',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Interactive: Story = {
  args: {
    defaultValue: '',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const input = canvas.getByRole('textbox', { name: 'Search filters' })

    await userEvent.click(input)
    await userEvent.type(input, 'Math')
    await expect(input).toHaveValue('Math')
  },
}