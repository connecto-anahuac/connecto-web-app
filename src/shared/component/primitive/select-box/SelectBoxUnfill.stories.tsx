import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import SelectBoxUnfill from './SelectBoxUnfill'

const options = [
  { label: 'Ingenieria', value: 'engineering' },
  { label: 'Derecho', value: 'law' },
  { label: 'Diseno', value: 'design' },
]

const meta = {
  title: 'Components/SelectBoxUnfill',
  component: SelectBoxUnfill,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    label: { control: 'text' },
    isMulti: { control: 'boolean' },
    options: { table: { disable: true } },
    defaultValue: { table: { disable: true } },
    icon: { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: {
    label: 'contiene',
    options,
    isMulti: false,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SelectBoxUnfill>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const SingleSelect: Story = {
  args: {
    label: 'empieza con',
  },
}

export const SingleSelectWithDefaultValue: Story = {
  args: {
    label: 'es',
    defaultValue: 'law',
  },
}

export const MultiSelect: Story = {
  args: {
    label: 'incluye',
    isMulti: true,
  },
}

export const MultiSelectWithDefaultValue: Story = {
  args: {
    label: 'incluye',
    isMulti: true,
    defaultValue: ['engineering', 'design'],
  },
}

export const CustomIcon: Story = {
  args: {
    icon: (
      <span aria-hidden="true" className="inline-flex size-4 items-center justify-center text-connecto-muted-strong">
        +
      </span>
    ),
  },
}

export const LongLabel: Story = {
  args: {
    label: 'coincide parcialmente con el criterio',
  },
}

export const SingleSelectInteractive: Story = {
  args: {
    label: 'es',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /es/i })

    await userEvent.click(trigger)

    const lawOption = canvas.getByRole('checkbox', { name: 'Derecho' })
    await expect(lawOption).toHaveAttribute('aria-checked', 'false')

    await userEvent.hover(lawOption)
    await userEvent.click(lawOption)

    await expect(canvas.getByRole('button', { name: /derecho/i })).toBeInTheDocument()
    await expect(canvas.queryByRole('checkbox', { name: 'Derecho' })).toBeNull()
  },
}

export const MultiSelectInteractive: Story = {
  args: {
    label: 'incluye',
    isMulti: true,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', { name: /incluye/i })

    await userEvent.click(trigger)

    const firstOption = canvas.getByRole('checkbox', { name: 'Ingenieria' })
    const secondOption = canvas.getByRole('checkbox', { name: 'Derecho' })

    await userEvent.click(firstOption)
    await expect(firstOption).toHaveAttribute('aria-checked', 'true')
    await expect(canvas.getByRole('button', { name: /ingenieria/i })).toBeInTheDocument()

    await userEvent.hover(secondOption)
    await userEvent.click(secondOption)

    await expect(secondOption).toHaveAttribute('aria-checked', 'true')
    await expect(canvas.getByRole('checkbox', { name: 'Ingenieria' })).toBeInTheDocument()
  },
}