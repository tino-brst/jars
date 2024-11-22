'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { CardIssuer, CardType } from '@prisma/client'

const schema = z.object({
  name: z.string(),
  issuer: z.nativeEnum(CardIssuer),
  type: z.nativeEnum(CardType),
  lastFourDigits: z
    .string()
    .length(4)
    .regex(RegExp('\\d{4,4}'), 'Must be 4 digits'),
  jarIds: z.array(z.string().uuid()).nonempty(),
})

async function createCard(formData: FormData) {
  const parse = schema.safeParse({
    ...Object.fromEntries(formData),
    jarIds: formData.getAll('jarIds'),
  })

  if (!parse.success) {
    throw parse.error.issues
  }

  const { jarIds, ...data } = parse.data

  await db.card.create({
    data: {
      ...data,
      jars: {
        create: jarIds.map((jarId) => ({
          jar: {
            connect: { id: jarId },
          },
        })),
      },
    },
  })

  revalidatePath('/', 'layout')
}

export { createCard }
