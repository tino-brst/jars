import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Home() {
  const jars = await prisma.jar.findMany()

  return (
    <main>
      <h1>Jars 🫙</h1>
      <ul>
        {jars.map((jar) => (
          <li key={jar.id}>{jar.name}</li>
        ))}
      </ul>
    </main>
  )
}
