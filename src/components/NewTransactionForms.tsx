import { createReceivedTransaction } from '@/actions/transactions'
import { AddTransactionSubmitButton } from '@/components/AddTransactionSubmitButton'

import { Input } from '@/components/primitives/Input'
import { Select } from '@/components/primitives/Select'
import { Jar, TransactionType } from '@prisma/client'

function NewTransactionForms({ jars }: { jars: Array<Jar> }) {
  return (
    <div className="mb-6 flex flex-col gap-2">
      <Select defaultValue={TransactionType.RECEIVED}>
        <option value={TransactionType.RECEIVED}>Received</option>
        <option value={TransactionType.SENT} disabled>
          Sent
        </option>
      </Select>

      <form className="flex flex-col gap-2" action={createReceivedTransaction}>
        <div className="flex items-center gap-2">
          <Input
            required
            type="text"
            name="counterparty"
            placeholder="from"
            className="flex-1"
          />
          <p>to</p>
          <Select required name="jarId">
            {jars.map((jar) => (
              <option value={jar.id} key={jar.id}>
                {jar.name} ({jar.currency})
              </option>
            ))}
          </Select>
        </div>

        <Input
          required
          type="number"
          name="amount"
          step="0.01"
          min="0"
          className="flex-1"
        />

        <AddTransactionSubmitButton />
      </form>
    </div>
  )
}

export { NewTransactionForms }
