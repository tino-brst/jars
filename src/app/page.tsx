import { db } from '@/lib/db'
import { createJar } from '@/actions/jars'
import { Select } from '@/components/primitives/Select'
import { Input } from '@/components/primitives/Input'
import { AddJarSubmitButton } from '@/components/AddJarSubmitButton'
import { Currency } from '@prisma/client'

async function Home() {
  const jars = await db.jar.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      JarBalance: true,
    },
  })

  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold">Jars</h1>

      <form action={createJar} className="mb-6 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <Input required type="text" name="name" className="flex-1" />
            <Select name="currency" defaultValue={Currency.USD} required>
              <option value={Currency.USD}>USD</option>
              <option value={Currency.ARS}>ARS</option>
              <option value={Currency.EUR}>EUR</option>
            </Select>
          </div>
        </div>

        <AddJarSubmitButton />
      </form>

      <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(8rem,100%),1fr))] gap-2">
        {jars.map((jar) => (
          <li
            key={jar.id}
            className="flex flex-col gap-1 rounded-xl bg-gray-100 px-3 py-2"
          >
            <p className="truncate font-medium">{jar.name}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-medium">
                {jar.JarBalance?.balance ?? 0 / 100}
              </p>
              <p className="text-gray-400">{jar.currency}</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}

export default Home
