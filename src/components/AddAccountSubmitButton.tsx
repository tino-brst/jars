'use client'

import { ComponentPropsWithRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/primitives/Button'

function AddAccountSubmitButton(
  props: Omit<ComponentPropsWithRef<'button'>, 'children'>,
) {
  const formStatus = useFormStatus()

  return (
    <Button disabled={formStatus.pending} {...props}>
      {formStatus.pending ? 'Adding ...' : 'Add Account'}
    </Button>
  )
}

export { AddAccountSubmitButton }
