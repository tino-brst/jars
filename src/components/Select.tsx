import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { ChevronSelectorVerticalIcon } from './icons/ChevronSelectorVerticalIcon'

function Select({
  className,
  children,
  ...props
}: ComponentPropsWithRef<'select'>) {
  return (
    <div className="relative inline-flex w-fit items-center">
      <select
        {...props}
        className={twMerge(
          'cursor-pointer appearance-none rounded-full border bg-white py-0.5 pl-2 pr-6 font-medium shadow-sm',
          className,
        )}
      >
        {children}
      </select>
      <ChevronSelectorVerticalIcon
        className="absolute right-1.5 text-gray-500"
        size={18}
      />
    </div>
  )
}

export { Select }
