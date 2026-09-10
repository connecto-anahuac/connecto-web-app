import { cn } from '@/shared/lib/util'

export type SemesterValue = 'ene-mayo' | 'verano' | 'ago-dec' | 'semester'

const SEMESTER_LABELS: Record<SemesterValue, string> = {
  'ene-mayo': 'Ene-May',
  verano: 'Verano',
  'ago-dec': 'Ago-Dec',
  semester: 'semestre',
}


interface Props {
  semester?: SemesterValue
  className?: string
}

export default function SemesterBadge({ semester = 'semester', className = '' }: Props) {
  const showDot = semester !== 'semester'
  const label = SEMESTER_LABELS[semester]

  // console.log('semester', semester, 'showDot', showDot, 'label', label)
  return (
    <div className={['flex items-center', className].join(' ')}>
      {showDot && (
        <span className={cn("relative size-2 shrink-0 mr-0.5 inline-block rounded-md",
          semester === 'ene-mayo' && 'bg-ene-mayo',
          semester === 'verano' && 'bg-summer',
          semester === 'ago-dec' && 'bg-ago-dec',
        )}
        />
      )}
      <span className="text-xs font-normal leading-none text-[#202020] whitespace-nowrap">{label}</span>
    </div>
  )
}
