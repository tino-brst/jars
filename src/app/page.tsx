import { db } from '@/lib/db'
import { createJar } from './actions/jars'

export default async function Home() {
  const jars = await db.jar.findMany()

  return (
    <main>
      <h1 className="mb-2 text-xl font-bold">Jars 🫙</h1>

      <form action={createJar} className="mb-4">
        <button className="rounded bg-gray-100 px-2">Add Jar</button>
      </form>

      <ul className="list-inside list-disc">
        {jars.map((jar) => (
          <li key={jar.id}>
            <span className="font-medium">{jar.name}</span> ・{' '}
            {jar.balance / 100}{' '}
            <span className="text-gray-400">{jar.currency}</span>
          </li>
        ))}
      </ul>
    </main>
  )
}
