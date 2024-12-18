import { ComponentPropsWithRef } from 'react'

function ChevronSelectorVerticalIcon({
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
        d="M7 15L12 20L17 15M7 9L12 4L17 9"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { ChevronSelectorVerticalIcon }
