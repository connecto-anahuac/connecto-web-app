import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, userEvent, within } from 'storybook/test'

import { MultiSelectFilter } from './MultiselectFilter'
import { FILTER_METADATA, FilterMetadataKeys } from '../shared/filter-metadata'
import { FilterDefinition, operators } from '../shared/filter-definition'

const baseFilter:FilterDefinition<string> = {
  key: 'name',
  label: 'Nombre',
  editor: 'multiSelect',
  valueType: 'multiSelect',
  inputType: 'option',
  operators: operators.slice(0,9),
  getValue: () => null,
  options: [
    { label: 'Ingenieria', value: 'engineering' },
    { label: 'Derecho', value: 'law' },
    { label: 'Diseno', value: 'design' },
  ],
} as const

const meta = {
  title: 'Features/Search/MultiselectFilter',
  component: MultiSelectFilter,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    filter: { table: { disable: true } },
  },
  args: {
      filter: baseFilter,
      filterMetadata:FILTER_METADATA[FilterMetadataKeys.name],
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MultiSelectFilter<string>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Status: Story = {
  args: {
   filterMetadata: FILTER_METADATA[FilterMetadataKeys.status],
  },
}
export const Semester: Story = {
  args: {
   filterMetadata: FILTER_METADATA[FilterMetadataKeys.semester],
  },
}

export const LongOptions: Story = {
  args: {
    filter: {
      ...baseFilter,
      options: [
        {
          label: 'Ingenieria en Sistemas Computacionales Avanzados',
          value: 'systems',
        },
        {
          label: 'Administracion y Direccion Estrategica de Empresas',
          value: 'business',
        },
      ],
    },
  },
}

export const EmptyOptions: Story = {
  args: {
    filter: {
      ...baseFilter,
      options: [],
    },
  },
}

export const Interactive: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const closeButton = canvas.getByRole('button', { name: 'Close Escuela filter' })
    const searchInput = canvas.getByRole('textbox', { name: 'Escuela' })

    await userEvent.click(closeButton)
    await expect(closeButton).toHaveFocus()
    await userEvent.click(searchInput)
    await expect(searchInput).toHaveValue('i')
    await userEvent.click(canvas.getByRole('button', { name: /escuela/i }))

    const firstOption = canvas.getByRole('checkbox', { name: 'Ingenieria' })

    await userEvent.click(firstOption)
    await expect(firstOption).toHaveAttribute('aria-checked', 'true')
    await expect(canvas.getByRole('button', { name: /ingenieria/i })).toBeInTheDocument()
  },
}