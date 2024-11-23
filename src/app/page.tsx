import { db } from '@/lib/db'
import { createJar } from '@/actions/jars'
import { Select } from '@/components/primitives/Select'
import { Input } from '@/components/primitives/Input'
import { AddJarSubmitButton } from '@/components/AddJarSubmitButton'
import { Currency } from '@prisma/client'

// TODO add prop sorting to Prettier/ESLint
// TODO update jar selectors to show account name

async function Home() {
  const accounts = await db.account.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      jarsWithBalance: true,
    },
  })

  const hasJars = accounts.some((account) => account.jarsWithBalance.length > 0)

  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold">Jars</h1>

      <form action={createJar} className="mb-6 flex flex-col gap-2">
        <div className="flex flex-col gap-2">
          <Select name="accountId" required>
            {accounts.map((account) => (
              <option key={account.id} value={account.id}>
                {account.name}
              </option>
            ))}
          </Select>
          <div className="flex gap-2">
            <Input required type="text" name="name" className="flex-1" />
            <Select name="currency" defaultValue={Currency.USD} required>
              <option value={Currency.USD}>USD</option>
              <option value={Currency.ARS}>ARS</option>
              <option value={Currency.EUR}>EUR</option>
            </Select>
          </div>
          <Input
            type="number"
            name="initialBalance"
            step="0.01"
            min="0"
            fallback="0"
          />
        </div>

        <AddJarSubmitButton />
      </form>

      {hasJars && (
        <ol className="flex flex-col gap-2">
          {accounts.map((account) => (
            <li
              key={account.id}
              className="flex flex-col gap-1 rounded-2xl border border-dashed p-2 pt-1"
            >
              <p className="pl-3 text-sm font-medium text-gray-400">
                {account.name}
              </p>
              <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(10rem,100%),1fr))] gap-2">
                {account.jarsWithBalance.map((jar) => (
                  <li
                    key={jar.id}
                    className="flex flex-col gap-1 rounded-xl bg-gray-100 px-3 py-2"
                  >
                    <p className="truncate font-medium">{jar.name}</p>
                    <div className="flex items-baseline gap-1">
                      <p className="text-2xl font-medium">
                        {jar.balance / 100}
                      </p>
                      <p className="text-gray-400">{jar.currency}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}

export default Home
