'use client'

import { createCard } from '@/actions/cards'
import { CardIssuer, CardType, Jar } from '@prisma/client'
import { AddCardSubmitButton } from './AddCardSubmitButton'
import { Select } from './primitives/Select'
import { Input } from './primitives/Input'
import { useState } from 'react'
import { Checkbox } from './primitives/Checkbox'

function NewCardForm({ jars }: { jars: Array<Jar> }) {
  const [selectedJarIds, setSelectedJarIds] = useState<Array<string>>([])
  const selectedJars = jars.filter((jar) => selectedJarIds.includes(jar.id))
  const selectedCurrencies = new Set(selectedJars.map((jar) => jar.currency))

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
        <fieldset className="flex flex-col gap-1 rounded-lg border border-dashed px-3 py-2">
          {jars.map((jar) => (
            <label key={jar.id} className="flex items-center gap-2">
              <Checkbox
                name="jarIds"
                value={jar.id}
                checked={selectedJarIds.includes(jar.id)}
                disabled={
                  !selectedJarIds.includes(jar.id) &&
                  selectedCurrencies.has(jar.currency)
                }
                onChange={(event) => {
                  setSelectedJarIds((jarIds) => {
                    return event.target.checked
                      ? [...jarIds, jar.id]
                      : jarIds.filter((id) => id !== jar.id)
                  })
                }}
              />
              <span>
                {jar.name} <span className="text-gray-400">{jar.currency}</span>
              </span>
            </label>
          ))}
        </fieldset>
      </div>

      <AddCardSubmitButton />
    </form>
  )
}

export { NewCardForm }
