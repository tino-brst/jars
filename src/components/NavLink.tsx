'use client'

import { ComponentProps } from 'react'
import { twMerge } from 'tailwind-merge'
import { Link } from '@/components/primitives/Link'

function NavLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={twMerge(
        'flex-1 px-4 pb-[calc(env(safe-area-inset-bottom)+theme(spacing.4))] pt-4 text-center text-sm font-medium text-black/40',
        'data-[active]:text-black',
        className,
      )}
      {...props}
    />
  )
}

export { NavLink }
