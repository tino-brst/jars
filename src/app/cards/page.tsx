import { createCard } from '@/actions/cards'
import { AddCardSubmitButton } from '@/components/AddCardSubmitButton'
import { Input } from '@/components/primitives/Input'
import { Select } from '@/components/primitives/Select'
import { db } from '@/lib/db'
import { CardIssuer, CardType } from '@prisma/client'
import React from 'react'

async function Cards() {
  const cards = await db.card.findMany({
    include: {
      jar: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

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

      <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-2">
        {cards.map((card) => (
          <li
            key={card.id}
            className="flex aspect-video flex-col justify-between rounded-lg bg-gray-100 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-200"
          >
            <div className="flex items-center justify-between">
              <p className="text-base font-medium">{card.jar.name}</p>
              <p className="text-sm font-medium text-gray-400">
                {card.jar.currency}
              </p>
            </div>
            <div className="flex items-baseline justify-between text-sm">
              <p>
                •••• <span>{card.lastFourDigits}</span>
              </p>
              <p className="text-gray-500">
                {card.type === 'DEBIT' && 'debit'}
                {card.type === 'CREDIT' && 'credit'}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}

export default Cards
