'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { TransactionType } from '@prisma/client'

const schema = z.object({
  type: z.enum([TransactionType.SENT, TransactionType.RECEIVED]),
  jarId: z.string().uuid(),
  counterparty: z.string(),
  amount: z.coerce
    .number()
    .nonnegative()
    .step(0.01)
    .transform((value) => value * 100),
})

async function createSentOrReceivedTransaction(formData: FormData) {
  const parse = schema.safeParse(Object.fromEntries(formData))

  if (!parse.success) {
    throw parse.error.issues
  }

  await db.transaction.create({
    data: {
      type: parse.data.type,
      ...(parse.data.type === 'SENT' && {
        sentTransaction: {
          create: {
            jarId: parse.data.jarId,
            counterparty: parse.data.counterparty,
            amount: -parse.data.amount,
          },
        },
      }),
      ...(parse.data.type === 'RECEIVED' && {
        receivedTransaction: {
          create: {
            jarId: parse.data.jarId,
            counterparty: parse.data.counterparty,
            amount: parse.data.amount,
          },
        },
      }),
    },
  })

  // TODO the revalidate should be specific to jars, not all of the things
  revalidatePath('/', 'layout')
}

export { createSentOrReceivedTransaction }
