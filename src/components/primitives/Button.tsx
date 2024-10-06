import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

function Button({ className, ...props }: ComponentPropsWithRef<'button'>) {
  return (
    <button
      className={twMerge(
        'rounded-full border bg-white px-3 py-0.5 font-medium shadow-sm transition-colors',
        'disabled:bg-gray-50 disabled:text-gray-500',
        className,
      )}
      {...props}
    />
  )
}

export { Button }
