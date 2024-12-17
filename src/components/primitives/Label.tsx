import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

function Label({ className, ...props }: ComponentPropsWithRef<'label'>) {
  return (
    <label
      className={twMerge(
        'flex items-center justify-between gap-2 whitespace-nowrap rounded-full border bg-white py-0.5 pl-3 font-medium text-gray-500 shadow-sm [&:has(:focus-visible)]:outline-blue-500',
        className,
      )}
      {...props}
    />
  )
}

export { Label }
