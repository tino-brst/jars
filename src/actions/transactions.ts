'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import {
  CreditCardTransaction,
  CreditCardUsageType,
  Currency,
  Transaction,
} from '@prisma/client'

// TODO make revalidation more specific, not all of the things

const sentOrReceivedTransactionSchema = z.object({
  jarId: z.string().uuid(),
  counterparty: z.string(),
  amount: z.coerce
    .number()
    .positive()
    .step(0.01)
    .transform((value) => value * 100),
})

async function createSentTransaction(formData: FormData) {
  const parse = sentOrReceivedTransactionSchema.safeParse(
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
  const parse = sentOrReceivedTransactionSchema.safeParse(
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

const movedTransactionSchema = z.object({
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
  const parse = movedTransactionSchema.safeParse(Object.fromEntries(formData))

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
    throw `Invalid transaction ((${fromAmount / 100} - ${fees / 100}) × ${conversionRate} = ${computedToAmount / 100} ≠ ${toAmount / 100})`
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

const debitCardTransactionSchema = z.object({
  cardId: z.string().uuid(),
  description: z.string(),
  currency: z.nativeEnum(Currency),
  amount: z.coerce
    .number()
    .positive()
    .step(0.01)
    .transform((value) => value * 100),
})

async function createDebitCardTransaction(formData: FormData) {
  const parse = debitCardTransactionSchema.safeParse(
    Object.fromEntries(formData),
  )

  if (!parse.success) {
    throw parse.error.issues
  }

  const card = await db.card.findUnique({
    where: {
      id: parse.data.cardId,
    },
    include: {
      account: {
        include: {
          jars: true,
        },
      },
    },
  })

  if (!card) {
    throw 'Card not found'
  }

  const associatedAccount = card.account
  const primaryJarForGivenCurrency = associatedAccount.jars
    .filter((jar) => jar.isPrimary)
    .find((jar) => jar.currency === parse.data.currency)

  if (!primaryJarForGivenCurrency) {
    throw 'Primary jar for given currency not found'
  }

  await db.transaction.create({
    data: {
      type: 'DEBIT_CARD',
      debitCardTransaction: {
        create: {
          cardId: parse.data.cardId,
          jarId: primaryJarForGivenCurrency.id,
          description: parse.data.description,
          amount: -parse.data.amount,
        },
      },
    },
  })

  revalidatePath('/', 'layout')
}

const baseCreditCardUsageSchema = z.object({
  cardId: z.string().uuid(),
  description: z.string(),
  currency: z.nativeEnum(Currency),
  amount: z.coerce
    .number()
    .positive()
    .step(0.01)
    .transform((value) => value * 100),
})

const creditCardUsageSchema = z.discriminatedUnion('type', [
  baseCreditCardUsageSchema.merge(
    z.object({
      type: z.literal(CreditCardUsageType.INSTALLMENTS),
      installmentsCount: z.coerce.number().int().positive(),
    }),
  ),
  // TODO ✋ add subscriptions support
  // baseCreditCardUsageSchema.merge(
  //   z.object({
  //     type: z.literal(CreditCardUsageType.SUBSCRIPTION),
  //   }),
  // ),
])

async function createCreditCardUsage(formData: FormData) {
  const parse = creditCardUsageSchema.safeParse(Object.fromEntries(formData))

  if (!parse.success) {
    console.log(parse.error.issues)
    throw parse.error.issues
  }

  const data = parse.data

  if (data.type === 'INSTALLMENTS') {
    // For installments, we register the usage and create all its associated
    // transactions (one per installment), each a month apart (in their
    // effectiveAt fields)

    const now = new Date()

    type RequiredCreditCardTransactionFields = Pick<
      Transaction,
      'effectiveAt'
    > &
      Pick<
        CreditCardTransaction,
        'installmentNumber' | 'originalAmount' | 'originalCurrency'
      >

    // When dividing the total amount by the number of installments, we might
    // not get rounded installmentAmounts, which we need given that we store
    // values in cents. So we round the amounts and keep track of how much we
    // left out, to later add it back in as part of one of the installments
    // (commonly the first or the last)
    const totalAmount = data.amount
    const installmentAmount = Math.floor(totalAmount / data.installmentsCount)
    const remainderAmount = totalAmount % data.installmentsCount

    const installments = Array.from(
      { length: data.installmentsCount },
      (_, index) => index + 1,
    ).map<RequiredCreditCardTransactionFields>((installmentNumber) => {
      const originalAmount = -(installmentNumber === 1
        ? installmentAmount + remainderAmount
        : installmentAmount)

      // Date.setMont takes into account days that might no repeat on the next
      // month (e.g. 31st of a month that doesn't have 31 days gets pushed to
      // 30/29/28 if needed)
      const effectiveAt = new Date(now)
      effectiveAt.setMonth(effectiveAt.getMonth() + installmentNumber - 1)

      return {
        installmentNumber,
        originalAmount,
        originalCurrency: data.currency,
        effectiveAt,
      }
    })

    await db.creditCardUsage.create({
      data: {
        type: 'INSTALLMENTS',
        cardId: data.cardId,
        description: data.description,
        amount: data.amount,
        currency: data.currency,
        createdAt: now,
        installmentsUsage: {
          create: {
            installmentsCount: data.installmentsCount,
          },
        },
        transactions: {
          create: installments.map((installment) => ({
            installmentNumber: installment.installmentNumber,
            originalAmount: installment.originalAmount,
            originalCurrency: installment.originalCurrency,
            transaction: {
              create: {
                type: 'CREDIT_CARD',
                createdAt: now,
                effectiveAt: installment.effectiveAt,
              },
            },
            card: {
              connect: {
                id: data.cardId,
              },
            },
          })),
        },
      },
    })
  }

  revalidatePath('/', 'layout')
}

export {
  createSentTransaction,
  createReceivedTransaction,
  createMovedTransaction,
  createDebitCardTransaction,
  createCreditCardUsage,
}
