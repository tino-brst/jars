import { db } from '@/lib/db'
import {
  Transaction as BaseTransaction,
  TransactionType,
  SentTransaction,
  ReceivedTransaction,
  Jar,
} from '@prisma/client'

type Transaction = Omit<BaseTransaction, 'type' | 'jarId'> & { jar: Jar } & (
    | (Omit<ReceivedTransaction, 'id' | 'transactionId'> & {
        type: typeof TransactionType.RECEIVED
      })
    | (Omit<SentTransaction, 'id' | 'transactionId'> & {
        type: typeof TransactionType.SENT
      })
  )

async function Transactions() {
  const transactions = (
    await db.transaction.findMany({
      include: {
        sentTransaction: true,
        receivedTransaction: true,
        jar: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  )
    .map<Transaction | null>((transaction) => {
      if (transaction.type === 'RECEIVED' && transaction.receivedTransaction) {
        return {
          ...transaction,
          ...transaction.receivedTransaction,
        }
      }

      if (transaction.type === 'SENT' && transaction.sentTransaction) {
        return {
          ...transaction,
          ...transaction.sentTransaction,
        }
      }

      return null
    })
    .filter((transaction): transaction is Transaction => transaction !== null)

  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold">Transactions</h1>

      <ul>
        {transactions.map((transaction) => (
          <>
            {transaction.type === 'RECEIVED' && (
              <li key={transaction.id}>{transaction.counterparty}</li>
            )}
            {transaction.type === 'SENT' && (
              <li key={transaction.id}>{transaction.counterparty}</li>
            )}
          </>
        ))}
      </ul>
    </main>
  )
}

export default Transactions
