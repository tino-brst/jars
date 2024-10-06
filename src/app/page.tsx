import { db } from '@/lib/db'
import { createJar } from '../actions/jars'
import { Button } from '@/components/primitives/Button'
import { Select } from '@/components/primitives/Select'
import { Input } from '@/components/primitives/Input'

async function Home() {
  const jars = await db.jar.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main>
      <h1 className="mb-4 text-xl font-bold">Jars</h1>

      <form action={createJar} className="mb-4 flex flex-col gap-2">
        <fieldset className="flex gap-2">
          <Input
            required
            type="text"
            name="name"
            placeholder="name"
            className="flex-1"
          />

          <Select name="currency" defaultValue="USD" required>
            <option value="USD">USD</option>
            <option value="ARS">ARS</option>
            <option value="EUR">EUR</option>
          </Select>
        </fieldset>

        <Button>Add Jar</Button>
      </form>

      <ol className="grid grid-cols-[repeat(auto-fill,minmax(min(8rem,100%),1fr))] gap-4">
        {jars.map((jar) => (
          <li
            key={jar.id}
            className="flex flex-col gap-1 rounded-xl bg-gray-100 px-3 py-2"
          >
            <p className="truncate font-medium">{jar.name}</p>
            <div className="flex items-baseline gap-1">
              <p className="text-2xl font-medium">{jar.balance / 100}</p>
              <p className="text-gray-400">{jar.currency}</p>
            </div>
          </li>
        ))}
      </ol>
    </main>
  )
}

export default Home
