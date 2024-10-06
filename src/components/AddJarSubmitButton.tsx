'use client'

import { ComponentPropsWithRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/primitives/Button'

function AddJarSubmitButton(
  props: Omit<ComponentPropsWithRef<'button'>, 'children'>,
) {
  const formStatus = useFormStatus()

  return (
    <Button disabled={formStatus.pending} {...props}>
      {formStatus.pending ? 'Adding ...' : 'Add Jar'}
    </Button>
  )
}

export { AddJarSubmitButton }
