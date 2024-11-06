import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

function Input({
  className,
  name,
  required,
  placeholder = name,
  min,
  max,
  fallback,
  ...props
}: ComponentPropsWithRef<'input'> & { fallback?: string | number }) {
  return (
    <input
      required={required}
      name={name}
      placeholder={[
        placeholder + (required ? '*' : ''),
        min !== undefined || max !== undefined
          ? `[${[min ?? '…', max ?? '…'].join(',')}]`
          : null,
        fallback !== undefined ? `= ${fallback}` : null,
      ]
        .filter(Boolean)
        .join(' ')}
      className={twMerge('min-w-0 rounded-lg border px-3 py-0.5', className)}
      {...props}
    />
  )
}

export { Input }
