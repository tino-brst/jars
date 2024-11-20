import { createCard } from '@/actions/cards'
import { AddCardSubmitButton } from '@/components/AddCardSubmitButton'
import { Input } from '@/components/primitives/Input'
import { Select } from '@/components/primitives/Select'
import { db } from '@/lib/db'
import { CardIssuer, CardType } from '@prisma/client'
import React from 'react'

// TODO query & list cards

async function Cards() {
  const jars = await db.jar.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold">Cards</h1>

      <form className="mb-6 flex flex-col gap-2" action={createCard}>
        <div className="flex flex-col gap-2">
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
          <Select required name="jarId">
            {jars.map((jar) => (
              <option value={jar.id} key={jar.id}>
                {jar.name} ({jar.currency})
              </option>
            ))}
          </Select>
        </div>

        <AddCardSubmitButton />
      </form>
    </main>
  )
}

export default Cards
