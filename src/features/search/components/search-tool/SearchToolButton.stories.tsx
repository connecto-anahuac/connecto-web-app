import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import SearchToolToggleButton from './SearchToolButton'


const meta = {
  title: 'Features/Search/SearchToolToggleButton',
  component: SearchToolToggleButton,
  parameters: {
    layout: 'centered',
    a11y: { test: 'todo' },
  },
  argTypes: {
    pressed: { control: 'boolean' },
    defaultPressed: { control: 'boolean' },
    onPressedChange: { action: 'pressedChanged' },
    onClick: { action: 'clicked' },
    className: { table: { disable: true } },
    type: { table: { disable: true } },
  },
  args: {
    defaultPressed: false,
    onPressedChange: fn(),
    onClick: fn(),
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SearchToolToggleButton>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Pressed: Story = {
  args: {
    pressed: true,
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
  },
}

export const Interactive: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Toggle search tools' })

    await expect(button).toHaveAttribute('aria-pressed', 'false')
    await userEvent.click(button)
    await expect(args.onClick).toHaveBeenCalled()
    await expect(args.onPressedChange).toHaveBeenCalledWith(true)
    await expect(button).toHaveAttribute('aria-pressed', 'true')
  },
}