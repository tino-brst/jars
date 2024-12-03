import * as RadixTabs from '@radix-ui/react-tabs'
import { ComponentPropsWithRef } from 'react'
import { twMerge } from 'tailwind-merge'

function Root({
  className,
  ...props
}: ComponentPropsWithRef<typeof RadixTabs.Root>) {
  return (
    <RadixTabs.Root
      {...props}
      className={twMerge('flex flex-col gap-2', className)}
    />
  )
}

function List({
  className,
  ...props
}: ComponentPropsWithRef<typeof RadixTabs.List>) {
  return (
    <RadixTabs.List
      {...props}
      className={twMerge(
        'flex items-center rounded-xl bg-gray-500/10 p-1',
        className,
      )}
    />
  )
}

function Trigger({
  className,
  ...props
}: ComponentPropsWithRef<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      {...props}
      className={twMerge(
        'flex-1 rounded-lg border-transparent px-3 py-0.5',
        'data-[state=active]:border data-[state=active]:bg-white data-[state=active]:font-medium data-[state=active]:shadow-sm',
        className,
      )}
    />
  )
}

const Tabs = {
  ...RadixTabs,
  Root,
  List,
  Trigger,
}

export { Tabs }
