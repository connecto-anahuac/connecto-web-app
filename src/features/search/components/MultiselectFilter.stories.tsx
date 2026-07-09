import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import { MultiSelectFilter } from './MultiselectFilter'
import PersonIcon from '@/components/icon/PersonIcon'
import { buildFilterDefinition } from '../shared/filter-factory'
import { defineFilterField } from '../shared/filter-field'

const baseFilter = buildFilterDefinition(
  defineFilterField<unknown>({
    key: 'name',
    label: 'Nombre',
    valueType: 'enum',
    inputType: 'option',
    getValue: () => null,
    options: [
      { label: 'Ingenieria', value: 'engineering' },
      { label: 'Derecho', value: 'law' },
      { label: 'Diseno', value: 'design' },
    ],
  }),
)

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
    icon: <PersonIcon />,
  },
  tags: ['autodocs'],
} satisfies Meta<typeof MultiSelectFilter<unknown>>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const LongOptions: Story = {
  args: {
    filter: buildFilterDefinition(
      defineFilterField<unknown>({
        key: 'name',
        label: 'Nombre',
        valueType: 'enum',
        inputType: 'option',
        getValue: () => null,
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
      }),
    ),
  },
}

export const EmptyOptions: Story = {
  args: {
    filter: buildFilterDefinition(
      defineFilterField<unknown>({
        key: 'name',
        label: 'Nombre',
        valueType: 'enum',
        inputType: 'option',
        getValue: () => null,
        options: [],
      }),
    ),
  },
}