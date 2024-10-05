import { db } from '@/lib/db'

export default async function Home() {
  const jars = await db.jar.findMany()

  return (
    <main>
      <h1 className="mb-2 text-xl font-bold">Jars 🫙</h1>
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
