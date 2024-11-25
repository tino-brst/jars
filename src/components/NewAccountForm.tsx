import { Input } from './primitives/Input'
import { AddAccountSubmitButton } from './AddAccountSubmitButton'
import { createAccount } from '@/actions/accounts'
import { FormContainer } from './FormContainer'

function NewAccountForm() {
  return (
    <FormContainer title="New Account">
      <form action={createAccount} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Input required type="text" name="name" className="flex-1" />
        </div>

        <AddAccountSubmitButton />
      </form>
    </FormContainer>
  )
}

export { NewAccountForm }
