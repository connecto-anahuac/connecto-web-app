import { cn } from '@/lib/util'
import React from 'react'

export type Semester = 'ene-mayo' | 'verano' | 'ago-dec' | 'semester'

const ELLIPSE_MAP: Record<Exclude<Semester, 'semester'>, string> = {
  'ene-mayo': 'https://www.figma.com/api/mcp/asset/06d9165c-0cf7-42b5-ae04-d70c4fc5b4c5',
  verano: 'https://www.figma.com/api/mcp/asset/be563df9-bef5-414f-9ce9-0600924adea8',
  'ago-dec': 'https://www.figma.com/api/mcp/asset/c895ab44-b5a7-49a2-8966-941d851053ba',
}

interface Props {
  semester?: Semester
  className?: string
}

export default function SemesterBadge({ semester = 'semester', className = '' }: Props) {
  const showDot = semester !== 'semester'
  const label =
    semester === 'ene-mayo' ? 'Ene-May' : semester === 'verano' ? 'Verano' : semester === 'ago-dec' ? 'Ago-Dec' : 'semestre'

  // console.log('semester', semester, 'showDot', showDot, 'label', label)
  return (
    <div className={['flex items-center', className].join(' ')}>
      {showDot && (
        <span className={cn("relative w-1.25 h-1.25 shrink-0 mr-0.5 inline-block rounded-md",
          semester === 'ene-mayo' && 'bg-ene-mayo',
          semester === 'verano' && 'bg-summer',
          semester === 'ago-dec' && 'bg-ago-dec',
        )}
        />
      )}
      <span className="text-[12px] font-normal leading-none text-[#202020] whitespace-nowrap">{label}</span>
    </div>
  )
}
