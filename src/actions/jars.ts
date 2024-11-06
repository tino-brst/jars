'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Currency } from '@prisma/client'

const schema = z.object({
  name: z.string(),
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

  await db.jar.create({
    data: {
      ...data,
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
