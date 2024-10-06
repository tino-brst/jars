'use client'

import NextLink from 'next/link'
import { ComponentProps } from 'react'
import { usePathname } from 'next/navigation'

/** A Next `Link` with the added `data-active` attribute for active links */
function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const pathname = usePathname()

  return (
    <NextLink
      href={href}
      data-active={pathname === href ? '' : undefined}
      {...props}
    />
  )
}

export { Link }
