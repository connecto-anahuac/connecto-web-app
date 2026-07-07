import type { Meta, StoryObj } from '@storybook/nextjs-vite'
import type { ComponentType } from 'react'

import Arrow from './Arrow'
import CloseIcon from './CloseIcon'
import EditIcon from './EditIcon'
import EmailIcon from './contact/EmailIcon'
import FilterIcon from './FilterIcon'
import HandleGripIcon from './HandleGripIcon'
import NumberAscendingIcon from './sorts/NumberAscendingIcon'
import NumberDescendingIcon from './sorts/NumberDescendingIcon'
import PersonIcon from './PersonIcon'
import SchoolEmailIcon from './contact/SchoolEmailIcon'
import SchoolHatIcon from './SchoolHatIcon'
import SearchIcon from './SearchIcon'
import SortIcon from './sorts/SortIcon'
import TextAscendingIcon from './sorts/TextAscendingIcon'
import TextDescendingIcon from './sorts/TextDescendingIcon'
import ToolFillIcon from './ToolFillIcon'
import ToolOutlineIcon from './ToolOutlineIcon'
import UnvisibleIcon from './UnvisibleIcon'
import WhatsAppIcon from './contact/WhatsAppIcon'
import ZoomInIcon from './ZoomInIcon'

type GalleryArgs = {
  iconClassName: string
  arrowDirection: 'left' | 'right' | 'up' | 'down'
}

type IconEntry = {
  name: string
  Component: ComponentType<{ className?: string }>
}

const icons: IconEntry[] = [
  { name: 'Arrow', Component: Arrow as ComponentType<{ className?: string }> },
  { name: 'CloseIcon', Component: CloseIcon },
  { name: 'EditIcon', Component: EditIcon },
  { name: 'EmailIcon', Component: EmailIcon },
  { name: 'FilterIcon', Component: FilterIcon },
  { name: 'HandleGripIcon', Component: HandleGripIcon },
  { name: 'NumberAscendingIcon', Component: NumberAscendingIcon },
  { name: 'NumberDescendingIcon', Component: NumberDescendingIcon },
  { name: 'PersonIcon', Component: PersonIcon },
  { name: 'SchoolEmailIcon', Component: SchoolEmailIcon },
  { name: 'SchoolHatIcon', Component: SchoolHatIcon },
  { name: 'SearchIcon', Component: SearchIcon },
  { name: 'SortIcon', Component: SortIcon },
  { name: 'TextAscendingIcon', Component: TextAscendingIcon },
  { name: 'TextDescendingIcon', Component: TextDescendingIcon },
  { name: 'ToolFillIcon', Component: ToolFillIcon },
  { name: 'ToolOutlineIcon', Component: ToolOutlineIcon },
  { name: 'UnvisibleIcon', Component: UnvisibleIcon },
  { name: 'WhatsAppIcon', Component: WhatsAppIcon },
  { name: 'ZoomInIcon', Component: ZoomInIcon },
]

function IconGallery({ iconClassName, arrowDirection }: GalleryArgs) {
  return (
    <div className="w-full max-w-6xl rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
      <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
        {icons.map(({ name, Component }) => (
          <div
            key={name}
            className="flex min-h-32 flex-col items-center justify-center gap-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-5 text-center"
          >
            <div className="flex min-h-10 items-center justify-center text-neutral-900">
              {name === 'Arrow' ? (
                <Arrow
                  direction={arrowDirection}
                  className={iconClassName}
                  aria-label={`${name} icon`}
                />
              ) : (
                <Component className={iconClassName} aria-label={`${name} icon`} />
              )}
            </div>
            <span className="break-all text-xs font-medium leading-5 text-neutral-600">{name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

const meta = {
  title: 'Components/Icons/IconGallery',
  component: IconGallery,
  parameters: {
    layout: 'padded',
    a11y: { test: 'todo' },
  },
  argTypes: {
    iconClassName: { control: 'text' },
    arrowDirection: { control: 'select', options: ['left', 'right', 'up', 'down'] },
  },
  args: {
    iconClassName: 'size-6 text-neutral-900',
    arrowDirection: 'left',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof IconGallery>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const ArrowDirections: Story = {
  args: {
    arrowDirection: 'down',
  },
}

export const LargeIcons: Story = {
  args: {
    iconClassName: 'size-8 text-neutral-900',
  },
}

export const MutedIcons: Story = {
  args: {
    iconClassName: 'size-6 text-neutral-500',
  },
}