import { NewCardForm } from '@/components/NewCardForm'
import { db } from '@/lib/db'
import React from 'react'

async function Cards() {
  const cards = await db.card.findMany({
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

      <NewCardForm jars={jars} />

      <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-2">
        {cards.map((card) => (
          <li
            key={card.id}
            className="flex aspect-video flex-col justify-between rounded-lg bg-gray-100 px-3 py-2 shadow-sm ring-1 ring-inset ring-gray-200"
          >
            <p className="text-base font-medium">{card.name}</p>
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
