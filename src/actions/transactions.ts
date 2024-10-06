'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  jarId: z.string().uuid(),
  counterparty: z.string(),
  amount: z.coerce
    .number()
    .nonnegative()
    .step(0.01)
    .transform((value) => value * 100),
})

async function createReceivedTransaction(formData: FormData) {
  const parse = schema.safeParse(Object.fromEntries(formData))

  if (!parse.success) {
    throw parse.error.issues
  }

  await db.transaction.create({
    data: {
      jarId: parse.data.jarId,
      type: 'RECEIVED',
      receivedTransaction: {
        create: {
          counterparty: parse.data.counterparty,
          amount: parse.data.amount,
        },
      },
    },
  })

  // TODO the revalidate should be specific to jars, not all of the things
  revalidatePath('/')
}

export { createReceivedTransaction }
