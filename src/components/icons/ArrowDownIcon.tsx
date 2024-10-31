import { ComponentPropsWithRef } from 'react'

function ArrowDownIcon({
  size = 24,
  width = size,
  height = size,
  ...props
}: ComponentPropsWithRef<'svg'> & {
  size?: number
}) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M12 5V19M12 19L19 12M12 19L5 12"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export { ArrowDownIcon }