import { ComponentPropsWithRef } from 'react'

function SwitchHorizontal01Icon({
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
        d="M20 17H4M4 17L8 13M4 17L8 21M4 7H20M20 7L16 3M20 7L16 11"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { SwitchHorizontal01Icon }
