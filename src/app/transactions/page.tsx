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
  Account,
  DebitCardTransaction,
  Card,
  CreditCardTransaction,
  CreditCardUsage as BaseCreditCardUsage,
  CreditCardSubscriptionUsage,
  CreditCardInstallmentsUsage,
  CreditCardUsageType,
} from '@prisma/client'
import React from 'react'

import { Link } from '@/components/primitives/Link'
import { TransactionsList } from '@/components/TransactionsList'
import { Tabs } from '@/components/primitives/Tabs'

type JarWithAccount = Omit<Jar, 'accountId'> & { account: Account }
type CardWithAccount = Omit<Card, 'accountId'> & { account: Account }

type CreditCardUsage = Omit<
  BaseCreditCardUsage,
  'type' | 'installmentsUsage' | 'subscriptionUsage'
> &
  (
    | (Omit<CreditCardInstallmentsUsage, 'usageId'> & {
        type: typeof CreditCardUsageType.INSTALLMENTS
      })
    | (Omit<CreditCardSubscriptionUsage, 'usageId'> & {
        type: typeof CreditCardUsageType.SUBSCRIPTION
      })
  )

export type Transaction = Omit<BaseTransaction, 'type'> &
  (
    | (Omit<InitTransaction, 'transactionId' | 'jarId'> & {
        type: typeof TransactionType.INIT
        jar: JarWithAccount
      })
    | (Omit<DebitCardTransaction, 'transactionId' | 'jarId' | 'cardId'> & {
        type: typeof TransactionType.DEBIT_CARD
        jar: JarWithAccount
        card: Card
      })
    | (Omit<
        CreditCardTransaction,
        'transactionId' | 'jarId' | 'cardId' | 'usageId'
      > & {
        type: typeof TransactionType.CREDIT_CARD
        jar: Jar | null
        card: CardWithAccount
        usage: CreditCardUsage
      })
    | (Omit<SentTransaction, 'transactionId' | 'jarId'> & {
        type: typeof TransactionType.SENT
        jar: JarWithAccount
      })
    | (Omit<ReceivedTransaction, 'transactionId' | 'jarId'> & {
        type: typeof TransactionType.RECEIVED
        jar: JarWithAccount
      })
    | (Omit<MovedTransaction, 'transactionId' | 'forJarId' | 'toJarId'> & {
        type: typeof TransactionType.MOVED
        fromJar: JarWithAccount
        toJar: JarWithAccount
      })
  )

async function Transactions() {
  const transactions = (
    await db.transaction.findMany({
      include: {
        initTransaction: {
          include: {
            jar: {
              include: {
                account: true,
              },
            },
          },
        },
        debitCardTransaction: {
          include: {
            jar: {
              include: {
                account: true,
              },
            },
            card: true,
          },
        },
        creditCardTransaction: {
          include: {
            usage: {
              include: {
                installmentsUsage: true,
                subscriptionUsage: true,
              },
            },
            jar: true,
            card: {
              include: {
                account: true,
              },
            },
          },
        },
        sentTransaction: {
          include: {
            jar: {
              include: {
                account: true,
              },
            },
          },
        },
        receivedTransaction: {
          include: {
            jar: {
              include: {
                account: true,
              },
            },
          },
        },
        movedTransaction: {
          include: {
            fromJar: {
              include: {
                account: true,
              },
            },
            toJar: {
              include: {
                account: true,
              },
            },
          },
        },
      },
      orderBy: {
        effectiveAt: 'desc',
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

      if (
        transaction.type === 'DEBIT_CARD' &&
        transaction.debitCardTransaction
      ) {
        return {
          ...transaction,
          ...transaction.debitCardTransaction,
          type: transaction.type,
        }
      }

      if (
        transaction.type === 'CREDIT_CARD' &&
        transaction.creditCardTransaction
      ) {
        if (
          transaction.creditCardTransaction.usage.type === 'INSTALLMENTS' &&
          transaction.creditCardTransaction.usage.installmentsUsage
        ) {
          return {
            ...transaction,
            ...transaction.creditCardTransaction,
            type: transaction.type,
            usage: {
              ...transaction.creditCardTransaction.usage,
              ...transaction.creditCardTransaction.usage.installmentsUsage,
              type: transaction.creditCardTransaction.usage.type,
            },
          }
        }

        if (
          transaction.creditCardTransaction.usage.type === 'SUBSCRIPTION' &&
          transaction.creditCardTransaction.usage.subscriptionUsage
        ) {
          return {
            ...transaction,
            ...transaction.creditCardTransaction,
            type: transaction.type,
            usage: {
              ...transaction.creditCardTransaction.usage,
              ...transaction.creditCardTransaction.usage.subscriptionUsage,
              type: transaction.creditCardTransaction.usage.type,
            },
          }
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

  const now = new Date()

  const pastTransactions = transactions.filter(
    (transaction) => transaction.effectiveAt <= now,
  )

  const upcomingTransactions = transactions
    .filter((transaction) => transaction.effectiveAt > now)
    .toReversed()

  const jars = await db.jarWithBalance.findMany()
  const accounts = await db.account.findMany()
  const cards = await db.card.findMany()

  const hasJars = jars.length > 0
  const hasTransactions = transactions.length > 0

  return (
    <main>
      <h1 className="mb-4 text-3xl font-bold">Transactions</h1>

      {hasJars && (
        <>
          <NewTransactionForms jars={jars} accounts={accounts} cards={cards} />

          {hasTransactions && (
            <Tabs.Root defaultValue="history">
              <Tabs.List>
                <Tabs.Trigger value="history">History</Tabs.Trigger>
                <Tabs.Trigger value="upcoming">Upcoming</Tabs.Trigger>
              </Tabs.List>
              <Tabs.Content value="history">
                <TransactionsList transactions={pastTransactions} />
              </Tabs.Content>
              <Tabs.Content value="upcoming">
                <TransactionsList transactions={upcomingTransactions} />
              </Tabs.Content>
            </Tabs.Root>
          )}
        </>
      )}

      {!hasJars && (
        <p className="rounded-2xl border border-dashed border-gray-100 bg-gray-50 p-8 py-16 text-center text-gray-500">
          To start using Transactions, you&apos;ll need to{' '}
          <Link href="/jars" className="whitespace-nowrap underline">
            create a jar
          </Link>{' '}
          first.
        </p>
      )}
    </main>
  )
}

export default Transactions
