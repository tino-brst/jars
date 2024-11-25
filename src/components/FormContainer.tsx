import { ComponentProps } from 'react'

function FormContainer({
  title,
  children,
  ...props
}: ComponentProps<'div'> & { title: string }) {
  return (
    <div className="relative -mx-4 mb-6 flex flex-col gap-3 border-y border-gray-100 bg-gray-50 p-4 pt-0">
      <p className="self-start rounded-b-md bg-gray-100 px-2 py-1 text-sm font-medium text-gray-600">
        {title}
      </p>
      {children}
    </div>
  )
}

export { FormContainer }
