import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

function Button({ className, ...props }: ComponentPropsWithRef<'button'>) {
  return (
    <button
      {...props}
      className={twMerge(
        'rounded-full border bg-white px-2 py-0.5 font-medium shadow-sm',
        className,
      )}
    />
  )
}

export { Button }
