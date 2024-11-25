import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'

function FormContainer({
  title,
  children,
  className,
  ...props
}: ComponentProps<'div'> & { title: string }) {
  return (
    <div
      className={twMerge(
        'relative -mx-4 mb-6 flex flex-col gap-3 border-y border-gray-100 bg-gray-50 p-4 pt-0',
        className,
      )}
      {...props}
    >
      <p className="self-start rounded-b-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600">
        {title}
      </p>
      {children}
    </div>
  )
}

export { FormContainer }
