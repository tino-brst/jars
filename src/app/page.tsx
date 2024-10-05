import { db } from '@/lib/db'
import { createJar } from './actions/jars'

async function Home() {
  const jars = await db.jar.findMany()

  async function formAction(formData: FormData) {
    'use server'

    await createJar({
      data: {
        name: formData.get('name') as string,
        currency: 'USD',
      },
    })
  }

  return (
    <main>
      <h1 className="mb-4 text-xl font-bold">Jars 🫙</h1>

      <form action={formAction} className="mb-4 flex flex-col gap-2">
        <input
          required
          type="text"
          name="name"
          placeholder="name"
          className="rounded border"
        />
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
