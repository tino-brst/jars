import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

function Input({
  className,
  name,
  placeholder = name,
  ...props
}: ComponentPropsWithRef<'input'>) {
  return (
    <input
      name={name}
      placeholder={placeholder}
      className={twMerge('rounded-lg border px-3 py-0.5', className)}
      {...props}
    />
  )
}

export { Input }
