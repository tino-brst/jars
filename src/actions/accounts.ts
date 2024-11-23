'use server'

import { z } from 'zod'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

const schema = z.object({
  name: z.string(),
})

async function createAccount(formData: FormData) {
  const parse = schema.safeParse(Object.fromEntries(formData))

  if (!parse.success) {
    throw parse.error.issues
  }

  await db.account.create({
    data: parse.data,
  })

  revalidatePath('/', 'layout')
}

export { createAccount }
