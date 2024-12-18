import { Account, Currency } from '@prisma/client'
import { AddJarSubmitButton } from './AddJarSubmitButton'
import { Select } from './primitives/Select'
import { createJar } from '@/actions/jars'
import { Input } from './primitives/Input'
import { FormContainer } from './FormContainer'
import { Label } from './primitives/Label'

function NewJarForm({ accounts }: { accounts: Array<Account> }) {
  return (
    <FormContainer title="New Jar">
      <form action={createJar} className="flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Label>
            Account
            <Select name="accountId" required>
              {accounts.map((account) => (
                <option key={account.id} value={account.id}>
                  {account.name}
                </option>
              ))}
            </Select>
          </Label>
          <div className="flex gap-2">
            <Input type="text" name="name" className="flex-1" />
            <Select name="currency" required>
              <option value={Currency.USD}>USD</option>
              <option value={Currency.ARS}>ARS</option>
              <option value={Currency.EUR}>EUR</option>
            </Select>
          </div>
          <Input
            type="number"
            name="initialBalance"
            step="0.01"
            min="0"
            fallback="0"
          />
        </div>

        <AddJarSubmitButton />
      </form>
    </FormContainer>
  )
}

export { NewJarForm }
