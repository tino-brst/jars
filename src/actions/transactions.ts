'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const sentOrReceivedTransactionFormDataSchema = z.object({
  jarId: z.string().uuid(),
  counterparty: z.string(),
  amount: z.coerce
    .number()
    .nonnegative()
    .step(0.01)
    .transform((value) => value * 100),
})

async function createSentTransaction(formData: FormData) {
  const parse = sentOrReceivedTransactionFormDataSchema.safeParse(
    Object.fromEntries(formData),
  )

  if (!parse.success) {
    throw parse.error.issues
  }

  await db.transaction.create({
    data: {
      type: 'SENT',
      sentTransaction: {
        create: {
          jarId: parse.data.jarId,
          counterparty: parse.data.counterparty,
          amount: -parse.data.amount,
        },
      },
    },
  })

  // TODO the revalidate should be specific to jars, not all of the things
  revalidatePath('/', 'layout')
}

async function createReceivedTransaction(formData: FormData) {
  const parse = sentOrReceivedTransactionFormDataSchema.safeParse(
    Object.fromEntries(formData),
  )

  if (!parse.success) {
    throw parse.error.issues
  }

  await db.transaction.create({
    data: {
      type: 'RECEIVED',
      receivedTransaction: {
        create: {
          jarId: parse.data.jarId,
          counterparty: parse.data.counterparty,
          amount: parse.data.amount,
        },
      },
    },
  })

  // TODO the revalidate should be specific to jars, not all of the things
  revalidatePath('/', 'layout')
}

const movedTransactionFormDataSchema = z.object({
  fromJarId: z.string().uuid(),
  fromAmount: z.coerce
    .number()
    .nonnegative()
    .step(0.01)
    .transform((value) => value * 100),
  toJarId: z.string().uuid(),
  toAmount: z.coerce
    .number()
    .nonnegative()
    .step(0.01)
    .transform((value) => value * 100),
  fees: z.coerce
    .number()
    .nonnegative()
    .step(0.01)
    .transform((value) => value * 100),
  // Coercion of an empty string to a number (Number('')) returns 0, which is
  // not what we want in the case of the conversionRate, which should default to
  // 1 if not provided
  // TODO nonzero
  conversionRate: z.preprocess(
    (value) => (value ? Number(value) : undefined),
    z.number().nonnegative().default(1),
  ),
})

async function createMovedTransaction(formData: FormData) {
  const parse = movedTransactionFormDataSchema.safeParse(
    Object.fromEntries(formData),
  )

  if (!parse.success) {
    throw parse.error.issues
  }

  const { fromAmount, toAmount, fees, conversionRate } = parse.data
  const fromAmountAfterFeesAndConversion = (fromAmount - fees) * conversionRate
  const isValidTransaction = fromAmountAfterFeesAndConversion === toAmount

  if (!isValidTransaction) {
    throw `Invalid transaction (${fromAmountAfterFeesAndConversion / 100} ≠ ${toAmount / 100})`
  }

  await db.transaction.create({
    data: {
      type: 'MOVED',
      movedTransaction: {
        create: {
          fromJarId: parse.data.fromJarId,
          fromAmount: -parse.data.fromAmount,
          toJarId: parse.data.toJarId,
          toAmount: parse.data.toAmount,
        },
      },
    },
  })

  // TODO the revalidate should be specific to jars, not all of the things
  revalidatePath('/', 'layout')
}

export {
  createSentTransaction,
  createReceivedTransaction,
  createMovedTransaction,
}
