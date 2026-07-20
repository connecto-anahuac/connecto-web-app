import type { Meta, StoryObj } from '@storybook/nextjs-vite'

import ToggleButton from './ToggleButton'
import { IconName, Icons } from '../icon'

const meta = {
  title: 'Components/Button/ToggleButton',
  component: ToggleButton,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
    argTypes: {
        icon: {
            control: {
                type: 'select',
          options: Object.keys(Icons) as IconName[],
            }
        },
    label: { control: 'text', description: 'Button label text' },
    isSelected: { control: 'boolean', description: 'Selected/unselected state' },
    hasBadge: { control: 'boolean', description: 'Show notification badge' },
    onClick: { action: 'clicked' },
    className: { table: { disable: true } },
    isEnabled: { table: { disable: true } },
  },
    args: {
      icon: 'pin',
    label: 'Pivot',
    isSelected: false,
    hasBadge: false,
    onClick: () => {},
  },
  tags: ['autodocs'],
} satisfies Meta<typeof ToggleButton>

export default meta
type Story = StoryObj<typeof meta>

/**
 * Default toggle button with badge in unselected state
 */
export const Default: Story = {}

/**
 * Toggle button in selected state with badge
 */
export const Selected: Story = {
  args: {
    isSelected: true,
  },
}

/**
 * Toggle button without notification badge
 */
export const WithBadge: Story = {
  args: {
    hasBadge: true,
  },
}

/**
 * Toggle button in selected state without badge
 */
export const SelectedWithBadge: Story = {
  args: {
    isSelected: true,
    hasBadge: true,
  },
}



/**
 * Interactive story: Click to toggle selection state
 */
// export const Interactive: Story = {
//   args: {
//     isSelected: false,
//     hasBadge: true,
//   },
//   play: async ({ canvasElement, args }) => {
//     const canvas = within(canvasElement)
//     const button = canvas.getByRole('button', { name: /Pivot/i })

//     // Verify initial state
//     await expect(button).toBeInTheDocument()

//     // Simulate click interaction
//     await userEvent.click(button)
//     await expect(args.onClick).toHaveBeenCalled()
//   },
// }

/**
 * Interactive story: Multiple toggles demonstrating state changes
 */
export const MultipleToggles: Story = {
  render: (args) => (
    <div className="flex gap-2">
      <ToggleButton {...args}  icon="pin" label="Pivot" isSelected={false} />
      <ToggleButton {...args}  icon="sort" label="Sort" isSelected={true} />
      <ToggleButton {...args}  icon="sort" label="Sort" isSelected={false} isEnabled={false} />
      <ToggleButton {...args}  icon="filter" label="Filter" isSelected={false} hasBadge={true} />
      <ToggleButton {...args}  icon="unvisible" label="Ocultado" isSelected={true} hasBadge={false} />
    </div>
  ),
  parameters: {
    layout: 'centered',
  },
}

/**
 * Disabled toggle button
 */
export const Disabled: Story = {
  args: {
    isEnabled: false,
  },
}
