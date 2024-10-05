'use server'

import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

async function createJar(...args: Parameters<typeof db.jar.create>) {
  await db.jar.create(...args)

  // TODO the revalidate should be specific to jars, not all of the things
  revalidatePath('/')
}

export { createJar }
