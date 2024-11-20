'use client'

import { ComponentPropsWithRef } from 'react'
import { useFormStatus } from 'react-dom'
import { Button } from '@/components/primitives/Button'

function AddCardSubmitButton(
  props: Omit<ComponentPropsWithRef<'button'>, 'children'>,
) {
  const formStatus = useFormStatus()

  return (
    <Button disabled={formStatus.pending} {...props}>
      {formStatus.pending ? 'Adding ...' : 'Add Card'}
    </Button>
  )
}

export { AddCardSubmitButton }
