'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CardIssuer, CardType } from '@prisma/client'

const schema = z.object({
  accountId: z.string().uuid(),
  issuer: z.nativeEnum(CardIssuer),
  type: z.nativeEnum(CardType),
  lastFourDigits: z
    .string()
    .length(4)
    .regex(RegExp('\\d{4,4}'), 'Must be 4 digits'),
})

async function createCard(formData: FormData) {
  const parse = schema.safeParse(Object.fromEntries(formData))

  if (!parse.success) {
    throw parse.error.issues
  }

  await db.card.create({
    data: parse.data,
  })

  revalidatePath('/', 'layout')
}

export { createCard }
