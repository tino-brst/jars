import { db } from '@/lib/db'
import { NewAccountForm } from '@/components/NewAccountForm'

async function Accounts() {
  const accounts = await db.account.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  const hasAccounts = accounts.length > 0

  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold">Accounts</h1>

      <NewAccountForm />

      {hasAccounts && (
        <ol className="flex flex-col gap-2">
          {accounts.map((account) => (
            <li key={account.id}>{account.name}</li>
          ))}
        </ol>
      )}
    </main>
  )
}

export default Accounts
