'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function createJar() {
  await db.jar.create({
    data: {
      name: 'New Jar',
      currency: 'USD',
    },
  })

  // TODO the revalidate should be specific to jars, not all of the things
  revalidatePath('/')
}

export { createJar }
