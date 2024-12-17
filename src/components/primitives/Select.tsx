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
        className={twMerge(
          'w-full cursor-pointer appearance-none truncate rounded-full border bg-white py-0.5 pl-3 pr-7 font-medium text-black shadow-sm',
          '[label_&]:-my-0.5 [label_&]:rounded-l-none [label_&]:border-none [label_&]:bg-transparent [label_&]:pl-2 [label_&]:shadow-none [label_&]:outline-none [label_&]:[text-align-last:right]',
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronSelectorVerticalIcon
        className="pointer-events-none absolute right-2 text-gray-500"
        size={18}
      />
    </div>
  )
}

export { Select }
