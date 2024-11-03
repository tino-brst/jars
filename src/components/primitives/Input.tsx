import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

function Input({
  className,
  name,
  required,
  placeholder = name,
  ...props
}: ComponentPropsWithRef<'input'>) {
  return (
    <input
      required
      name={name}
      placeholder={required ? placeholder + '*' : placeholder}
      className={twMerge('min-w-0 rounded-lg border px-3 py-0.5', className)}
      {...props}
    />
  )
}

export { Input }
