import { ArrowDownLeftIcon } from '@/components/icons/ArrowDownLeftIcon'
import { ArrowUpRightIcon } from '@/components/icons/ArrowUpRightIcon'
import { CoinsStacked03Icon } from '@/components/icons/CoinsStacked03Icon'
import { SwitchHorizontal01Icon } from '@/components/icons/SwitchHorizontal01Icon'
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
import React, { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'
import { Link } from '@/components/primitives/Link'
import { CreditCardIcon } from '@/components/icons/CreditCardIcon'

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

type Transaction = Omit<BaseTransaction, 'type'> &
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
            <ol className="flex flex-col gap-2">
              {transactions.map((transaction) => (
                <Fragment key={transaction.id}>
                  {transaction.type === 'INIT' && (
                    <li className="flex min-h-16 items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 p-2">
                          <CoinsStacked03Icon size={20} />
                        </div>
                        <div className="flex flex-col">
                          <p className="font-medium">
                            {transaction.jar.name ?? transaction.jar.currency}
                          </p>
                          <p className="text-xs font-medium text-gray-400">
                            Jar added to {transaction.jar.account.name}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                          {!!transaction.amount && (
                            <PlusIcon
                              size={12}
                              strokeWidth={3}
                              className="text-gray-400"
                            />
                          )}
                          <p className="text-lg font-medium">
                            {transaction.amount / 100}{' '}
                            <span className="text-base text-gray-400">
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

                  {transaction.type === 'DEBIT_CARD' && (
                    <li className="flex min-h-16 items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 p-2">
                          <CreditCardIcon size={20} />
                        </div>
                        <p className="font-medium">{transaction.description}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-medium">
                          {Math.abs(transaction.amount / 100)}{' '}
                          <span className="text-base text-gray-400">
                            {transaction.jar.currency}
                          </span>
                        </p>
                        <p className="text-xs font-medium text-gray-400">
                          Spent from {transaction.jar.account.name} / ••••{' '}
                          {transaction.card.lastFourDigits}
                        </p>
                      </div>
                    </li>
                  )}

                  {transaction.type === 'CREDIT_CARD' &&
                    transaction.usage.type === 'INSTALLMENTS' && (
                      <li className="flex min-h-16 items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                        <div className="flex items-center gap-3">
                          <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 p-2">
                            <CreditCardIcon size={20} />
                          </div>
                          <div className="flex flex-col">
                            <p className="font-medium">
                              {transaction.usage.description}
                            </p>
                            <p className="text-xs font-medium text-gray-400">
                              Installment {transaction.installmentNumber} of{' '}
                              {transaction.usage.installmentsCount}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end">
                          <p className="text-lg font-medium">
                            {Math.abs(transaction.originalAmount / 100)}{' '}
                            <span className="text-base text-gray-400">
                              {transaction.originalCurrency}
                            </span>
                          </p>
                          <p className="text-xs font-medium text-gray-400">
                            Payed with {transaction.card.account.name} / ••••{' '}
                            {transaction.card.lastFourDigits}
                          </p>
                        </div>
                      </li>
                    )}

                  {transaction.type === 'SENT' && (
                    <li className="flex min-h-16 items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 p-2">
                          <ArrowUpRightIcon size={20} />
                        </div>
                        <p className="font-medium">
                          {transaction.counterparty}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-medium">
                          {Math.abs(transaction.amount / 100)}{' '}
                          <span className="text-base text-gray-400">
                            {transaction.jar.currency}
                          </span>
                        </p>
                        <p className="text-xs font-medium text-gray-400">
                          Sent from {transaction.jar.account.name}
                          {' / '}
                          {transaction.jar.name ?? transaction.jar.currency}
                        </p>
                      </div>
                    </li>
                  )}

                  {transaction.type === 'RECEIVED' && (
                    <li className="flex min-h-16 items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 p-2">
                          <ArrowDownLeftIcon size={20} />
                        </div>
                        <p className="font-medium">
                          {transaction.counterparty}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <div className="flex items-baseline gap-1">
                          {!!transaction.amount && (
                            <PlusIcon
                              size={12}
                              strokeWidth={3}
                              className="text-gray-400"
                            />
                          )}
                          <p className={twMerge('text-lg font-medium')}>
                            {transaction.amount / 100}{' '}
                            <span className="text-base text-gray-400">
                              {transaction.jar.currency}
                            </span>
                          </p>
                        </div>
                        <p className="text-xs font-medium text-gray-400">
                          Received to {transaction.jar.account.name}
                          {' / '}
                          {transaction.jar.name ?? transaction.jar.currency}
                        </p>
                      </div>
                    </li>
                  )}

                  {transaction.type === 'MOVED' && (
                    <li className="flex min-h-16 items-center justify-between rounded-xl bg-gray-100 px-3 py-2">
                      <div className="flex items-center gap-3">
                        <div className="flex w-fit items-center justify-center rounded-full bg-gray-200 p-2">
                          <SwitchHorizontal01Icon size={20} />
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="flex flex-col">
                            <p className="font-medium">
                              {transaction.fromJar.name ??
                                transaction.fromJar.currency}
                            </p>
                            <p className="text-xs font-medium text-gray-400">
                              {transaction.fromJar.account.name}
                            </p>
                          </div>
                          <ArrowRightIcon
                            size={12}
                            strokeWidth={3}
                            className="text-gray-400"
                          />
                          <div className="flex flex-col">
                            <p className="font-medium">
                              {transaction.toJar.name ??
                                transaction.toJar.currency}
                            </p>
                            <p className="text-xs font-medium text-gray-400">
                              {transaction.toJar.account.name}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-lg font-medium">
                          {Math.abs(transaction.toAmount / 100)}{' '}
                          <span className="text-base text-gray-400">
                            {transaction.toJar.currency}
                          </span>
                        </p>
                        <p className="text-xs font-medium text-gray-400">
                          {!!transaction.fees &&
                            !!transaction.conversionRate &&
                            transaction.conversionRate !== 1 &&
                            `(${Math.abs(transaction.fromAmount / 100)} ${transaction.fromJar.currency} - ${transaction.fees / 100}) × ${transaction.conversionRate} `}
                          {!!transaction.fees &&
                            (!transaction.conversionRate ||
                              transaction.conversionRate === 1) &&
                            `${Math.abs(transaction.fromAmount / 100)} ${transaction.fromJar.currency} - ${transaction.fees / 100} `}
                          {!transaction.fees &&
                            !!transaction.conversionRate &&
                            transaction.conversionRate !== 1 &&
                            `${Math.abs(transaction.fromAmount / 100)} ${transaction.fromJar.currency} × ${transaction.conversionRate} `}
                        </p>
                      </div>
                    </li>
                  )}
                </Fragment>
              ))}
            </ol>
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
