'use client'

import { createCard } from '@/actions/cards'
import { CardIssuer, CardType } from '@prisma/client'
import { AddCardSubmitButton } from './AddCardSubmitButton'
import { Select } from './primitives/Select'
import { Input } from './primitives/Input'

function NewCardForm() {
  return (
    <form className="mb-6 flex flex-col gap-2" action={createCard}>
      <div className="flex flex-col gap-2">
        <Input type="text" name="name" required autoComplete="off" />
        <div className="flex gap-2">
          <Select
            name="issuer"
            defaultValue={CardIssuer.VISA}
            required
            className="flex-1"
          >
            <option value={CardIssuer.VISA}>Visa</option>
            <option value={CardIssuer.MASTERCARD}>Mastercard</option>
          </Select>
          <Select
            name="type"
            defaultValue={CardType.DEBIT}
            required
            className="flex-1"
          >
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
  )
}

export { NewCardForm }
