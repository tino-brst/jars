'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Currency } from '@prisma/client'

const schema = z.object({
  accountId: z.string().uuid(),
  name: z
    .string()
    .nullable()
    .transform((value) => (value === '' ? null : value)),
  currency: z.nativeEnum(Currency),
  initialBalance: z.coerce
    .number()
    .nonnegative()
    .step(0.01)
    .transform((value) => value * 100)
    .optional(),
})

async function createJar(formData: FormData) {
  const parse = schema.safeParse(Object.fromEntries(formData))

  if (!parse.success) {
    throw parse.error.issues
  }

  const { initialBalance, ...data } = parse.data

  const sameAccountJarsWithGivenCurrency = await db.jar.findMany({
    where: {
      accountId: data.accountId,
      currency: data.currency,
    },
  })

  const isFirstAccountJarWithGivenCurrency =
    sameAccountJarsWithGivenCurrency.length === 0

  await db.jar.create({
    data: {
      ...data,
      isPrimary: isFirstAccountJarWithGivenCurrency,
      initTransaction: {
        create: {
          amount: initialBalance,
          transaction: {
            create: {
              type: 'INIT',
            },
          },
        },
      },
    },
  })

  revalidatePath('/', 'layout')
}

export { createJar }
