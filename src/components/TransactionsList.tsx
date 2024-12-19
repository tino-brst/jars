import { ArrowDownLeftIcon } from '@/components/icons/ArrowDownLeftIcon'
import { ArrowUpRightIcon } from '@/components/icons/ArrowUpRightIcon'
import { CoinsStacked03Icon } from '@/components/icons/CoinsStacked03Icon'
import { SwitchHorizontal01Icon } from '@/components/icons/SwitchHorizontal01Icon'

import { PlusIcon } from '@/components/icons/PlusIcon'
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'
import { CreditCardIcon } from '@/components/icons/CreditCardIcon'

import { Transaction } from '@/app/transactions/page'
import { CreditCardUpIcon } from './icons/CreditCardUpIcon'

function TransactionsList({
  transactions,
}: {
  transactions: Array<Transaction>
}) {
  const transactionsMap = transactions.reduce<
    Map<number, Map<number, Array<Transaction>>>
  >((map, transaction) => {
    const date = transaction.effectiveAt
    const year = date.getFullYear()
    const month = date.getMonth()

    // TODO ✋ refactor

    if (!map.has(year)) {
      map.set(year, new Map())
    }

    if (!map.get(year)?.has(month)) {
      map.get(year)?.set(month, [])
    }

    map.get(year)?.get(month)?.push(transaction)

    return map
  }, new Map())

  return (
    <ol>
      {Array.from(transactionsMap).map(([year, monthsMap]) => (
        <li key={year}>
          <ol className="flex flex-col gap-3">
            {Array.from(monthsMap).map(([month, transactions]) => {
              const isCurrentMonth = new Date().getMonth() === month

              // e.g. "December 2024"
              const transactionsGroupLabel = new Intl.DateTimeFormat('en', {
                month: 'long',
                year: 'numeric',
              }).format(new Date(year, month))

              return (
                <li key={`${year}-${month}`} className="flex flex-col gap-2">
                  <span className="text-sm font-medium text-gray-500">
                    {isCurrentMonth ? 'This month' : transactionsGroupLabel}
                  </span>
                  <ol className="flex flex-col gap-2">
                    {transactions.map((transaction) => (
                      <TransactionListItem
                        key={transaction.id}
                        transaction={transaction}
                      />
                    ))}
                  </ol>
                </li>
              )
            })}
          </ol>
        </li>
      ))}
    </ol>
  )
}

function TransactionListItem({ transaction }: { transaction: Transaction }) {
  return (
    <>
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
                <PlusIcon size={12} strokeWidth={3} className="text-gray-400" />
              )}
              <p className="font-medium">
                {transaction.amount / 100}{' '}
                <span className="text-base text-gray-400">
                  {transaction.jar.currency}
                </span>
              </p>
            </div>
            <p className="text-xs font-medium text-gray-400">Initial Balance</p>
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
            <p className="font-medium">
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
                <CreditCardUpIcon size={20} />
              </div>
              <div className="flex flex-col">
                <p className="font-medium">{transaction.usage.description}</p>
                <p className="text-xs font-medium text-gray-400">
                  Installment {transaction.installmentNumber} of{' '}
                  {transaction.usage.installmentsCount}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <p className="font-medium">
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
            <p className="font-medium">{transaction.counterparty}</p>
          </div>
          <div className="flex flex-col items-end">
            <p className="font-medium">
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
            <p className="font-medium">{transaction.counterparty}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              {!!transaction.amount && (
                <PlusIcon size={12} strokeWidth={3} className="text-gray-400" />
              )}
              <p className="font-medium">
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
                  {transaction.fromJar.name ?? transaction.fromJar.currency}
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
                  {transaction.toJar.name ?? transaction.toJar.currency}
                </p>
                <p className="text-xs font-medium text-gray-400">
                  {transaction.toJar.account.name}
                </p>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end">
            <p className="font-medium">
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
    </>
  )
}

export { TransactionsList }
