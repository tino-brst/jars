import { Input } from './primitives/Input'
import { AddAccountSubmitButton } from './AddAccountSubmitButton'
import { createAccount } from '@/actions/accounts'

function NewAccountForm() {
  return (
    <form action={createAccount} className="mb-6 flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Input required type="text" name="name" className="flex-1" />
      </div>

      <AddAccountSubmitButton />
    </form>
  )
}

export { NewAccountForm }
