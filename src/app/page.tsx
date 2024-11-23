import { db } from '@/lib/db'
import { NewJarForm } from '@/components/NewJarForm'
import { Link } from '@/components/primitives/Link'

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

  const hasAccounts = accounts.length > 0
  const hasJars = accounts.some((account) => account.jarsWithBalance.length > 0)

  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold">Jars</h1>

      {hasAccounts && (
        <>
          <NewJarForm accounts={accounts} />

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
        </>
      )}

      {!hasAccounts && (
        <p className="rounded-2xl border border-dashed border-gray-100 bg-gray-50 p-8 py-16 text-center text-gray-500">
          To start using Jars, you&apos;ll need to{' '}
          <Link href="/" className="whitespace-nowrap underline">
            create an account
          </Link>{' '}
          first.
        </p>
      )}
    </main>
  )
}

export default Home
