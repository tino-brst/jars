import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { ChevronSelectorVerticalIcon } from '../icons/ChevronSelectorVerticalIcon'

function Select({
  className,
  children,
  ...props
}: ComponentPropsWithRef<'select'>) {
  return (
    <div className={twMerge('relative flex min-w-0 items-center', className)}>
      <select
        className="w-full cursor-pointer appearance-none truncate rounded-full border bg-white py-0.5 pl-3 pr-7 font-medium shadow-sm"
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
