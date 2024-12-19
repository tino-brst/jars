import { ComponentPropsWithRef, HTMLInputTypeAttribute } from 'react'
import { twMerge } from 'tailwind-merge'

function Input({
  className,
  name,
  required,
  placeholder = name,
  min,
  max,
  fallback,
  type = 'text',
  ...props
}: Omit<ComponentPropsWithRef<'input'>, 'type'> & {
  type?: Extract<HTMLInputTypeAttribute, 'text' | 'number' | 'date'>
  fallback?: string | number
}) {
  return (
    <input
      type={type}
      name={name}
      required={required}
      min={min}
      max={max}
      placeholder={[
        placeholder + (required ? '*' : ''),
        min !== undefined || max !== undefined
          ? `[${[min ?? '…', max ?? '…'].join(',')}]`
          : null,
        fallback !== undefined ? `= ${fallback}` : null,
      ]
        .filter(Boolean)
        .join(' ')}
      className={twMerge(
        'min-w-0 rounded-lg border bg-white px-3 py-0.5 text-black [&::-webkit-calendar-picker-indicator]:hidden',
        type === 'date' &&
          '[label_&]:-my-0.5 [label_&]:rounded-none [label_&]:border-none [label_&]:bg-transparent [label_&]:pl-2 [label_&]:text-right [label_&]:outline-none',
        className,
      )}
      {...props}
    />
  )
}

export { Input }
