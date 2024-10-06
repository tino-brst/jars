'use client'

import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { Link } from '@/components/primitives/Link'

function NavLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={twMerge(
        'text-sm font-medium opacity-40',
        'data-[active]:opacity-100',
        className,
      )}
      {...props}
    />
  )
}

export { NavLink }
