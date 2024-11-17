import { ArrowDownLeftIcon } from '@/components/icons/ArrowDownLeftIcon'
import { ArrowUpRightIcon } from '@/components/icons/ArrowUpRightIcon'
import { CoinsStacked03Icon } from '@/components/icons/CoinsStacked03Icon'
import { SwitchHorizontal01Icon } from '@/components/icons/SwitchHorizontal01Icon'
import { ChevronRightIcon } from '@/components/icons/ChevronRightIcon'
import { NewTransactionForms } from '@/components/NewTransactionForms'

import { db } from '@/lib/db'
import {
  Transaction as BaseTransaction,
  TransactionType,
  InitTransaction,
  ReceivedTransaction,
  SentTransaction,
  Jar,
  MovedTransaction,
} from '@prisma/client'
import React, { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'
import { PlusIcon } from '@/components/icons/PlusIcon'

type Transaction = Omit<BaseTransaction, 'type'> &
  (
    | (Omit<InitTransaction, 'transactionId' | 'jarId'> & {
        type: typeof TransactionType.INIT
        jar: Jar
      })
    | (Omit<SentTransaction, 'transactionId' | 'jarId'> & {
        type: typeof TransactionType.SENT
        jar: Jar
      })
    | (Omit<ReceivedTransaction, 'transactionId' | 'jarId'> & {
        type: typeof TransactionType.RECEIVED
        jar: Jar
      })
    | (Omit<MovedTransaction, 'transactionId' | 'forJarId' | 'toJarId'> & {
        type: typeof TransactionType.MOVED
        fromJar: Jar
        toJar: Jar
      })
  )

async function Transactions() {
  const transactions = (
    await db.transaction.findMany({
      include: {
        initTransaction: {
          include: {
            jar: true,
          },
        },
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
        movedTransaction: {
          include: {
            fromJar: true,
            toJar: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })
  )
    .map<Transaction | null>((transaction) => {
      if (transaction.type === 'INIT' && transaction.initTransaction) {
        return {
          ...transaction,
          ...transaction.initTransaction,
          // For some reason, even if transaction.type is correctly typed here
          // ('INIT'), leaving it as part of ...transaction makes TS complain 🤷🏻‍♂️
          type: transaction.type,
        }
      }

      if (transaction.type === 'SENT' && transaction.sentTransaction) {
        return {
          ...transaction,
          ...transaction.sentTransaction,
          type: transaction.type,
        }
      }

      if (transaction.type === 'RECEIVED' && transaction.receivedTransaction) {
        return {
          ...transaction,
          ...transaction.receivedTransaction,
          type: transaction.type,
        }
      }

      if (transaction.type === 'MOVED' && transaction.movedTransaction) {
        return {
          ...transaction,
          ...transaction.movedTransaction,
          type: transaction.type,
          fromJar: transaction.movedTransaction.fromJar,
          toJar: transaction.movedTransaction.toJar,
        }
      }

      return null
    })
    .filter((transaction): transaction is Transaction => transaction !== null)

  const jars = await db.jarWithBalance.findMany({
    orderBy: {
      name: 'asc',
    },
  })

  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold">Transactions</h1>

      <NewTransactionForms jars={jars} />

      <ol className="flex flex-col gap-2">
        {transactions.map((transaction) => (
          <Fragment key={transaction.id}>
            {transaction.type === 'INIT' && (
              <li className="flex items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 p-2">
                    <CoinsStacked03Icon size={20} />
                  </div>
                  <p className="font-medium">{transaction.jar.name}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    {!!transaction.amount && (
                      <PlusIcon
                        size={12}
                        strokeWidth={4}
                        className="text-gray-400"
                      />
                    )}
                    <p className="text-lg font-medium">
                      {transaction.amount / 100}{' '}
                      <span className="text-base text-gray-500">
                        {transaction.jar.currency}
                      </span>
                    </p>
                  </div>
                  <p className="text-xs font-medium text-gray-400">
                    Initial Balance
                  </p>
                </div>
              </li>
            )}

            {transaction.type === 'SENT' && (
              <li className="flex items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 p-2">
                    <ArrowUpRightIcon size={20} />
                  </div>
                  <p className="font-medium">{transaction.counterparty}</p>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-lg font-medium">
                    {Math.abs(transaction.amount / 100)}{' '}
                    <span className="text-base text-gray-500">
                      {transaction.jar.currency}
                    </span>
                  </p>
                  <p className="text-xs font-medium text-gray-400">
                    Sent from {transaction.jar.name}
                  </p>
                </div>
              </li>
            )}

            {transaction.type === 'RECEIVED' && (
              <li className="flex items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 p-2">
                    <ArrowDownLeftIcon size={20} />
                  </div>
                  <p className="font-medium">{transaction.counterparty}</p>
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-baseline gap-1">
                    {!!transaction.amount && (
                      <PlusIcon
                        size={12}
                        strokeWidth={4}
                        className="text-gray-400"
                      />
                    )}
                    <p className={twMerge('text-lg font-medium')}>
                      {transaction.amount / 100}{' '}
                      <span className="text-base text-gray-500">
                        {transaction.jar.currency}
                      </span>
                    </p>
                  </div>
                  <p className="text-xs font-medium text-gray-400">
                    Added to {transaction.jar.name}
                  </p>
                </div>
              </li>
            )}

            {transaction.type === 'MOVED' && (
              <li className="flex items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                <div className="flex items-center gap-3">
                  <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 p-2">
                    <SwitchHorizontal01Icon size={20} />
                  </div>
                  <div className="flex items-center gap-1">
                    <p className="font-medium">{transaction.fromJar.name}</p>
                    <ChevronRightIcon
                      size={12}
                      strokeWidth={4}
                      className="text-gray-400"
                    />
                    <p className="font-medium">{transaction.toJar.name}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-lg font-medium">
                    {Math.abs(transaction.fromAmount / 100)}{' '}
                    <span className="text-base text-gray-500">
                      {transaction.fromJar.currency}
                    </span>
                  </p>
                  <p className="text-xs font-medium text-gray-400">
                    <span className="text-gray-300">
                      {`(${Math.abs(transaction.fromAmount / 100)} - ${transaction.fees / 100}) × ${transaction.conversionRate} = `}
                    </span>
                    {transaction.toAmount / 100} {transaction.toJar.currency}
                  </p>
                </div>
              </li>
            )}
          </Fragment>
        ))}
      </ol>
    </main>
  )
}

export default Transactions
