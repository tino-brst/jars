import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

function Input({ className, ...props }: ComponentPropsWithRef<'input'>) {
  return (
    <input
      {...props}
      className={twMerge('rounded-lg border px-3 py-0.5', className)}
    />
  )
}

export { Input }
