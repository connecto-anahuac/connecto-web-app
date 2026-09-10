import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'

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
    onChipRemove: { action: 'chipRemoved' },
  },
  args: {
    placeholder: 'Search filters',
    defaultValue: 'Ing',
    'aria-label': 'Search filters',
    onChipRemove: fn(),
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

export const WrappedChips: Story = {
  args: {
    chips: [
      { label: 'Ingenieria', value: 'engineering' },
      { label: 'Derecho', value: 'law' },
      {
        label: 'Administracion y Direccion Estrategica',
        value: 'business',
      },
    ],
    defaultValue: '',
    placeholder: 'Buscar opciones',
  },
  render: (args) => (
    <div className="w-64">
      <FilterSearchInput {...args} />
    </div>
  ),
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)

    await userEvent.click(
      canvas.getByRole('button', { name: 'Remove Ingenieria' }),
    )
    await expect(args.onChipRemove).toHaveBeenCalledWith('engineering')

    const input = canvas.getByRole('textbox', { name: 'Search filters' })
    await userEvent.type(input, 'Math')
    await expect(input).toHaveValue('Math')
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
