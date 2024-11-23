import { Account, Currency } from '@prisma/client'
import { AddJarSubmitButton } from './AddJarSubmitButton'
import { Select } from './primitives/Select'
import { createJar } from '@/actions/jars'
import { Input } from './primitives/Input'

function NewJarForm({ accounts }: { accounts: Array<Account> }) {
  return (
    <form action={createJar} className="mb-6 flex flex-col gap-2">
      <div className="flex flex-col gap-2">
        <Select name="accountId" required>
          {accounts.map((account) => (
            <option key={account.id} value={account.id}>
              {account.name}
            </option>
          ))}
        </Select>
        <div className="flex gap-2">
          <Input type="text" name="name" className="flex-1" />
          <Select name="currency" defaultValue={Currency.USD} required>
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
  )
}

export { NewJarForm }
