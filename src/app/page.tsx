import { db } from '@/lib/db'
import { createJar } from '../actions/jars'

async function Home() {
  const jars = await db.jar.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main>
      <h1 className="mb-4 text-xl font-bold">Jars 🫙</h1>

      <form action={createJar} className="mb-4 flex flex-col gap-2">
        <fieldset className="flex gap-2">
          <input
            required
            type="text"
            name="name"
            placeholder="name"
            className="flex-1 rounded border"
          />
          <select name="currency" defaultValue="USD" required>
            <option value="USD">USD</option>
            <option value="ARS">ARS</option>
            <option value="EUR">EUR</option>
          </select>
        </fieldset>

        <button className="rounded bg-gray-100 px-2">Add Jar</button>
      </form>

      <ul className="space-y-2">
        {jars.map((jar) => (
          <li key={jar.id}>
            <span className="font-medium">{jar.name}</span>・{jar.balance / 100}{' '}
            <span className="text-gray-400">{jar.currency}</span>
            <p className="text-sm text-gray-300">
              {jar.createdAt.toLocaleString()}
            </p>
          </li>
        ))}
      </ul>
    </main>
  )
}

export default Home
