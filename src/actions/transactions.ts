'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

// TODO make revalidation more specific, not all of the things

const sentOrReceivedTransactionFormDataSchema = z.object({
  jarId: z.string().uuid(),
  counterparty: z.string(),
  amount: z.coerce
    .number()
    .positive()
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

  revalidatePath('/', 'layout')
}

const movedTransactionFormDataSchema = z.object({
  fromJarId: z.string().uuid(),
  fromAmount: z.coerce
    .number()
    .positive()
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
  conversionRate: z.preprocess(
    (value) => (value ? Number(value) : undefined),
    z.number().positive().default(1),
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

  // To check if the set of values is valid, we get a computedToAmount from the
  // fromAmount, fees, and conversionRate; and check if it equals the provided
  // toAmount. The flooring on the computedToAmount is done so to match the fact
  // that we store amounts as integers (cents) and that's what the user inputs.
  // Thus, even if the conversionRate being a float might lead to a value with a
  // decimal part, we drop it when comparing
  //
  // Example:
  //
  // Even if the user input is valid, without the flooring our computedToAmount
  // value would be different and fail validation
  //
  // fromAmount = 1000 ($10.00)
  // toAmount = 1281 ($12.81)
  // fees = 100 ($1.00)
  // conversionRate = 1.4242
  //
  // computedToAmount = (1000 - 100) * 1.4242 = 1281.78 ≠ 1281 💥

  const computedToAmount = Math.floor((fromAmount - fees) * conversionRate)
  const isValidTransaction = toAmount === computedToAmount

  if (!isValidTransaction) {
    throw `Invalid transaction ((${fromAmount / 100} - ${fees / 100}) * ${conversionRate} = ${computedToAmount / 100} ≠ ${toAmount / 100})`
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
          fees: parse.data.fees,
          conversionRate: parse.data.conversionRate,
        },
      },
    },
  })

  revalidatePath('/', 'layout')
}

export {
  createSentTransaction,
  createReceivedTransaction,
  createMovedTransaction,
}
