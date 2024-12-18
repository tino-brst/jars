import { ComponentPropsWithRef } from 'react'

function ArrowDownLeftIcon({
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
        d="M17 7L7 17M7 17H17M7 17V7"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { ArrowDownLeftIcon }
