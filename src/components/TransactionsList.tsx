import { Fragment } from 'react'

import { ArrowDownLeftIcon } from '@/components/icons/ArrowDownLeftIcon'
import { ArrowUpRightIcon } from '@/components/icons/ArrowUpRightIcon'
import { CoinsStacked03Icon } from '@/components/icons/CoinsStacked03Icon'
import { SwitchHorizontal01Icon } from '@/components/icons/SwitchHorizontal01Icon'

import { twMerge } from 'tailwind-merge'
import { PlusIcon } from '@/components/icons/PlusIcon'
import { ArrowRightIcon } from '@/components/icons/ArrowRightIcon'
import { CreditCardIcon } from '@/components/icons/CreditCardIcon'

import { Transaction } from '@/app/transactions/page'

function TransactionsList({
  transactions,
}: {
  transactions: Array<Transaction>
}) {
  return (
    <ol className="flex flex-col gap-2">
      {transactions.map((transaction) => (
        <TransactionListItem key={transaction.id} transaction={transaction} />
      ))}
    </ol>
  )
}

function TransactionListItem({ transaction }: { transaction: Transaction }) {
  return (
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
                <PlusIcon size={12} strokeWidth={3} className="text-gray-400" />
              )}
              <p className="text-lg font-medium">
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
                <p className="font-medium">{transaction.usage.description}</p>
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
            <p className="font-medium">{transaction.counterparty}</p>
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
            <p className="font-medium">{transaction.counterparty}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="flex items-baseline gap-1">
              {!!transaction.amount && (
                <PlusIcon size={12} strokeWidth={3} className="text-gray-400" />
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
  )
}

export { TransactionsList }
