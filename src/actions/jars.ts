'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'
import { Currency } from '@prisma/client'

const schema = z.object({
  name: z.string(),
  currency: z.nativeEnum(Currency),
})

async function createJar(formData: FormData) {
  const parse = schema.safeParse(Object.fromEntries(formData))

  if (!parse.success) {
    return
  }

  await db.jar.create({ data: parse.data })

  // TODO the revalidate should be specific to jars, not all of the things
  revalidatePath('/')
}

export { createJar }
