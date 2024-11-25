'use client'

import { createCard } from '@/actions/cards'
import { Account, CardIssuer, CardType } from '@prisma/client'
import { AddCardSubmitButton } from './AddCardSubmitButton'
import { Select } from './primitives/Select'
import { Input } from './primitives/Input'
import { FormContainer } from './FormContainer'

function NewCardForm({ accounts }: { accounts: Array<Account> }) {
  return (
    <FormContainer title="New Card">
      <form className="flex flex-col gap-2" action={createCard}>
        <div className="flex flex-col gap-2">
          <Select name="accountId" required>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
          <div className="flex gap-2">
            <Select name="issuer" required className="flex-1">
              <option value={CardIssuer.VISA}>Visa</option>
              <option value={CardIssuer.MASTERCARD}>Mastercard</option>
            </Select>
            <Select name="type" required className="flex-1">
              <option value={CardType.DEBIT}>Debit</option>
              <option value={CardType.CREDIT}>Credit</option>
            </Select>
          </div>
          <Input
            type="text"
            name="lastFourDigits"
            required
            minLength={4}
            maxLength={4}
            pattern="\d{4,4}"
            autoComplete="off"
          />
        </div>

        <AddCardSubmitButton />
      </form>
    </FormContainer>
  )
}

export { NewCardForm }
