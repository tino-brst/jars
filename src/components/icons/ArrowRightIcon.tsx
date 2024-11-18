import { ComponentPropsWithRef } from 'react'

function ArrowRightIcon({
  size = 24,
  width = size,
  height = size,
  strokeWidth = 2,
  ...props
}: ComponentPropsWithRef<'svg'> & {
  size?: number
}) {
  return (
    <svg
      width={width}
      height={height}
      strokeWidth={strokeWidth}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5 12H19M19 12L12 5M19 12L12 19"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { ArrowRightIcon }
