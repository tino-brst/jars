import { createReceivedTransaction } from '@/actions/transactions'
import { AddTransactionSubmitButton } from '@/components/AddTransactionSubmitButton'
import { ArrowDownIcon } from '@/components/icons/ArrowDownIcon'
import { Input } from '@/components/primitives/Input'
import { Select } from '@/components/primitives/Select'
import { db } from '@/lib/db'
import {
  Transaction as BaseTransaction,
  TransactionType,
  SentTransaction,
  ReceivedTransaction,
  Jar,
} from '@prisma/client'
import React from 'react'

type Transaction = Omit<BaseTransaction, 'type'> & { jar: Jar } & (
    | (Omit<ReceivedTransaction, 'id' | 'transactionId' | 'jarId'> & {
        type: typeof TransactionType.RECEIVED
      })
    | (Omit<SentTransaction, 'id' | 'transactionId' | 'jarId'> & {
        type: typeof TransactionType.SENT
      })
  )

async function Transactions() {
  const transactions = (
    await db.transaction.findMany({
      include: {
        sentTransaction: {
          include: {
            jar: true,
          },
        },
        receivedTransaction: {
          include: {
            jar: true,
          },
        },
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

  const jars = await db.jar.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold">Transactions</h1>

      <div className="mb-6 flex flex-col gap-2">
        <Select defaultValue={TransactionType.RECEIVED}>
          <option value={TransactionType.RECEIVED}>Received</option>
          <option value={TransactionType.SENT} disabled>
            Sent
          </option>
        </Select>

        <form
          className="flex flex-col gap-2"
          action={createReceivedTransaction}
        >
          <div className="flex items-center gap-2">
            <Input
              required
              type="text"
              name="counterparty"
              placeholder="from"
              className="flex-1"
            />
            <p>to</p>
            <Select required name="jarId">
              {jars.map((jar) => (
                <option value={jar.id} key={jar.id}>
                  {jar.name} ({jar.currency})
                </option>
              ))}
            </Select>
          </div>

          <Input
            required
            type="number"
            name="amount"
            step="0.01"
            min="0"
            className="flex-1"
          />

          <AddTransactionSubmitButton />
        </form>
      </div>

      <ol className="flex flex-col gap-2">
        {transactions.map((transaction) => (
          <>
            {transaction.type === 'RECEIVED' && (
              <li className="flex items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                <div className="flex items-center gap-4">
                  <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 p-1">
                    <ArrowDownIcon size={24} />
                  </div>
                  <p className="font-medium">{transaction.counterparty}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-lg font-medium">
                    {transaction.amount / 100}{' '}
                    <span className="text-base text-gray-500">
                      {transaction.jar.currency}
                    </span>
                  </p>
                  <p className="text-sm font-medium text-gray-400">
                    added to {transaction.jar.name}
                  </p>
                </div>
              </li>
            )}
          </>
        ))}
      </ol>
    </main>
  )
}

export default Transactions
