import React from 'react'

type Props = {
  leftValue: string
  leftLabel?: string
  rightValue: string
  rightLabel?: string
  className?: string
}

export default function CourseValues({
  leftValue,
  leftLabel = 'créd.',
  rightValue,
  rightLabel = 'Hrs.',
  className = '',
}: Props) {
  return (
    <div className={`flex items-baseline gap-1 whitespace-nowrap ${className}`}>
      <div className="flex items-baseline gap-0.5 text-xs leading-none">
        <span className="font-normal text-black">{leftValue}</span>
        <span className="text-xs text-black opacity-90">{leftLabel}</span>
      </div>

      {/* <div className="w-fit min-h-full py-0.5 flex flex-col">
          <div className="w-px bg-[#313131] rounded-md  flex-1" aria-hidden />
      </div> */}
         {/* <div className="w-px bg-[#313131] rounded-md  h-full" aria-hidden /> */}
     <div className="self-stretch flex py-0.5">
    <div className="w-px bg-[#313131]" />
  </div>

      <div className="flex items-baseline gap-0.5 text-xs leading-none">
        <span className="font-normal text-black">{rightValue}</span>
        <span className="text-xs text-black opacity-90">{rightLabel}</span>
      </div>
    </div>
  )
}
