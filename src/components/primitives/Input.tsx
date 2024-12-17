import { ComponentPropsWithRef, HTMLInputTypeAttribute } from 'react'
import { twMerge } from 'tailwind-merge'

// TODO ✋ add proper date support, with the label on the left and the date
// picker/picked on the right. Maybe a whole different component?

function Input({
  className,
  name,
  required,
  placeholder = name,
  min,
  max,
  fallback,
  ...props
}: Omit<ComponentPropsWithRef<'input'>, 'type'> & {
  type?: Extract<HTMLInputTypeAttribute, 'text' | 'number' | 'date'>
  fallback?: string | number
}) {
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
