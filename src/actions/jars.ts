'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Currency } from '@prisma/client'

const schema = z.object({
  name: z.string(),
  currency: z.nativeEnum(Currency),
  balance: z.coerce
    .number()
    .nonnegative()
    .step(0.01)
    .transform((value) => value * 100),
})

async function createJar(formData: FormData) {
  const parse = schema.safeParse(Object.fromEntries(formData))

  if (!parse.success) {
    throw parse.error.issues
  }

  await db.jar.create({ data: parse.data })

  // TODO the revalidate should be specific to jars, not all of the things
  revalidatePath('/')
}

export { createJar }
