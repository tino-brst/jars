import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { ChevronSelectorVerticalIcon } from '../icons/ChevronSelectorVerticalIcon'

function Select({
  className,
  children,
  ...props
}: ComponentPropsWithRef<'select'>) {
  return (
    <div className="relative flex items-center">
      <select
        className={twMerge(
          'w-full cursor-pointer appearance-none rounded-full border bg-white py-0.5 pl-3 pr-7 font-medium shadow-sm',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronSelectorVerticalIcon
        className="absolute right-2 text-gray-500"
        size={18}
      />
    </div>
  )
}

export { Select }
