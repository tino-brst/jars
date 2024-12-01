import { db } from '@/lib/db'
import { NewAccountForm } from '@/components/NewAccountForm'

async function Accounts() {
  const accounts = await db.account.findMany({
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      jars: true,
    },
  })

  const accountTotalBalancesByCurrency = await db.jarWithBalance.groupBy({
    by: ['accountId', 'currency'],
    _sum: {
      balance: true,
    },
  })

  const accountsWithTotalBalancesByCurrency = accounts.map((account) => ({
    ...account,
    totalBalancesByCurrency: accountTotalBalancesByCurrency
      .filter((currencyBalance) => currencyBalance.accountId === account.id)
      .map((currencyBalance) => ({
        currency: currencyBalance.currency,
        value: currencyBalance._sum.balance ?? 0,
      }))
      .sort((a, b) => b.value - a.value),
  }))

  const hasAccounts = accounts.length > 0

  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold">Accounts</h1>

      <NewAccountForm />

      {hasAccounts && (
        <ol className="flex flex-col gap-2">
          {accountsWithTotalBalancesByCurrency.map((account) => (
            <li
              key={account.id}
              className="flex flex-col rounded-xl bg-gray-100 px-3 py-3"
            >
              <p className="font-medium">{account.name}</p>
              {!account.jars.length && (
                <p className="text-sm font-medium text-gray-400">
                  No jars on this account
                </p>
              )}

              {!!account.totalBalancesByCurrency.length && (
                <ul className="flex gap-4">
                  {account.totalBalancesByCurrency.map((balance) => (
                    <li key={balance.currency}>
                      <span className="text-2xl font-medium">
                        {balance.value / 100}
                      </span>{' '}
                      <span className="text-gray-400">{balance.currency}</span>
                    </li>
                  ))}
                </ul>
              )}

              {/* TODO ✋ primary jar selection? */}
            </li>
          ))}
        </ol>
      )}
    </main>
  )
}

export default Accounts
