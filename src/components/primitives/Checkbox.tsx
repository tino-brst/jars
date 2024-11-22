import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

// TODO add icon

function Checkbox({
  className,
  ...prop
}: Omit<ComponentProps<'input'>, 'type'>) {
  return (
    <input
      type="checkbox"
      className={twMerge(
        'size-5 appearance-none rounded border bg-white transition-colors checked:border-blue-500 checked:bg-blue-500 disabled:bg-gray-100',
        className,
      )}
      {...prop}
    />
  )
}

export { Checkbox }
