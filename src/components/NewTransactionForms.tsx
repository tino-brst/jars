'use client'

import { useState } from 'react'

import {
  createMovedTransaction,
  createSentTransaction,
  createReceivedTransaction,
} from '@/actions/transactions'
import { AddTransactionSubmitButton } from '@/components/AddTransactionSubmitButton'

import { Input } from '@/components/primitives/Input'
import { Select } from '@/components/primitives/Select'
import { Account, JarWithBalance, TransactionType } from '@prisma/client'

// TODO clear inputs after submit (I think this already works?)
// TODO stricter ts, array[number]: something | undefined

// TODO ✋ card transaction form

type AccountWithJarsWithBalance = Account & {
  jarsWithBalance: Array<JarWithBalance>
}

function NewTransactionForms({
  accounts,
}: {
  accounts: Array<AccountWithJarsWithBalance>
}) {
  const jars = accounts.flatMap((account) => account.jarsWithBalance)
  const hasNonEmptyJars = jars.some((jar) => jar.balance > 0)
  const hasMoreThanOneJar = jars.length > 1

  const [transactionType, setTransactionType] = useState<TransactionType>(
    hasNonEmptyJars ? TransactionType.SENT : TransactionType.RECEIVED,
  )

  return (
    <div className="mb-6 flex flex-col gap-2">
      <Select
        value={transactionType}
        onChange={(event) =>
          setTransactionType(event.target.value as TransactionType)
        }
      >
        {hasNonEmptyJars && (
          <>
            <option value={TransactionType.SENT}>Sent</option>
            <option value={TransactionType.RECEIVED}>Received</option>
            {hasMoreThanOneJar && (
              <option value={TransactionType.MOVED}>Moved</option>
            )}
            {!hasMoreThanOneJar && (
              <optgroup label="Not enough jars">
                <option value={TransactionType.MOVED} disabled>
                  Moved
                </option>
              </optgroup>
            )}
          </>
        )}

        {!hasNonEmptyJars && (
          <>
            <option value={TransactionType.RECEIVED}>Received</option>
            <hr />
            <optgroup label="Not enough balance">
              <option value={TransactionType.SENT} disabled>
                Sent
              </option>
              <option value={TransactionType.MOVED} disabled>
                Moved
              </option>
            </optgroup>
          </>
        )}
      </Select>

      {transactionType === 'SENT' && (
        <SentTransactionForm accounts={accounts} />
      )}

      {transactionType === 'RECEIVED' && (
        <ReceivedTransactionForm accounts={accounts} />
      )}

      {transactionType === 'MOVED' && (
        <MovedTransactionForm accounts={accounts} />
      )}
    </div>
  )
}

function SentTransactionForm({
  accounts,
}: {
  accounts: Array<AccountWithJarsWithBalance>
}) {
  const accountsWithJars = accounts.filter(
    (account) => account.jarsWithBalance.length > 0,
  )

  const jars = accounts.flatMap((account) => account.jarsWithBalance)
  const firstNonEmptyJar = jars.find((jar) => jar.balance > 0)
  const [jarId, setJarId] = useState(firstNonEmptyJar?.id)
  const jar = jars.find((jar) => jar.id === jarId)

  return (
    <form className="flex flex-col gap-2" action={createSentTransaction}>
      <Input
        required
        type="number"
        name="amount"
        step="0.01"
        min="0.01"
        max={(jar?.balance ?? 0) / 100}
        className="flex-1"
      />

      <div className="flex items-center gap-2">
        <Input
          required
          type="text"
          name="counterparty"
          placeholder="to"
          className="flex-1"
        />
        <p>from</p>
        <Select
          required
          name="jarId"
          value={jarId}
          onChange={(event) => setJarId(event.target.value)}
        >
          {accountsWithJars.map((account) => (
            <optgroup key={account.id} label={account.name}>
              {account.jarsWithBalance.map((jar) => (
                <option key={jar.id} value={jar.id} disabled={!jar.balance}>
                  {account.name}
                  {' / '}
                  {jar.name ? `${jar.name} (${jar.currency})` : jar.currency}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </div>

      <AddTransactionSubmitButton />
    </form>
  )
}

function ReceivedTransactionForm({
  accounts,
}: {
  accounts: Array<AccountWithJarsWithBalance>
}) {
  const accountsWithJars = accounts.filter(
    (account) => account.jarsWithBalance.length > 0,
  )

  return (
    <form className="flex flex-col gap-2" action={createReceivedTransaction}>
      <Input
        required
        type="number"
        name="amount"
        step="0.01"
        min="0.01"
        className="flex-1"
      />

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
          {accountsWithJars.map((account) => (
            <optgroup key={account.id} label={account.name}>
              {account.jarsWithBalance.map((jar) => (
                <option key={jar.id} value={jar.id}>
                  {account.name}
                  {' / '}
                  {jar.name ? `${jar.name} (${jar.currency})` : jar.currency}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </div>

      <AddTransactionSubmitButton />
    </form>
  )
}

function MovedTransactionForm({
  accounts,
}: {
  accounts: Array<AccountWithJarsWithBalance>
}) {
  // TODO 🐛 if the transaction empties the source jar, the form is reset after
  // submission but the from & to selects are set to the same jar. Actually,
  // looks like any transactions resets the selects to the first jar (even if
  // disabled)

  const accountsWithJars = accounts.filter(
    (account) => account.jarsWithBalance.length > 0,
  )

  const jars = accounts.flatMap((account) => account.jarsWithBalance)

  const firstNonEmptyJar = jars.find((jar) => jar.balance > 0)
  const [fromJarId, setFromJarId] = useState(firstNonEmptyJar?.id)
  const fromJar = jars.find((jar) => jar.id === fromJarId)

  const firstJarNotFromJar = jars.find((jar) => jar.id !== fromJarId)
  const [toJarId, setToJarId] = useState(firstJarNotFromJar?.id)
  const toJar = jars.find((jar) => jar.id === toJarId)

  const isJarSwapValid = !!toJar?.balance

  return (
    <form className="flex flex-col gap-2" action={createMovedTransaction}>
      <div className="flex items-center gap-2">
        <Input
          required
          type="number"
          name="fromAmount"
          step="0.01"
          min="0.01"
          max={(fromJar?.balance ?? 0) / 100}
          className="flex-1"
        />
        <Select
          required
          className="flex-1"
          name="fromJarId"
          value={fromJarId}
          onChange={(event) => {
            const newFromJarId = event.target.value

            // If picking the current toJar as the fromJar, do a swap
            if (newFromJarId === toJarId) {
              setToJarId(fromJarId)
            }

            setFromJarId(newFromJarId)
          }}
        >
          {accountsWithJars.map((account) => (
            <optgroup key={account.id} label={account.name}>
              {account.jarsWithBalance.map((jar) => (
                <option key={jar.id} value={jar.id} disabled={!jar.balance}>
                  {account.name}
                  {' / '}
                  {jar.name ? `${jar.name} (${jar.currency})` : jar.currency}
                  {jar.id === toJarId && ' [toJar]'}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Input
          required
          type="number"
          name="toAmount"
          step="0.01"
          min="0"
          className="flex-1"
        />
        <Select
          required
          className="flex-1"
          name="toJarId"
          value={toJarId}
          onChange={(event) => {
            const newToJarId = event.target.value

            // If picking the current fromJar as the toJar, do a swap
            if (newToJarId === fromJarId) {
              setFromJarId(toJarId)
            }

            setToJarId(newToJarId)
          }}
        >
          {accountsWithJars.map((account) => (
            <optgroup key={account.id} label={account.name}>
              {account.jarsWithBalance.map((jar) => (
                <option
                  key={jar.id}
                  value={jar.id}
                  disabled={jar.id === fromJarId && !isJarSwapValid}
                >
                  {account.name}
                  {' / '}
                  {jar.name ? `${jar.name} (${jar.currency})` : jar.currency}
                  {jar.id === fromJarId && ' [fromJar]'}
                </option>
              ))}
            </optgroup>
          ))}
        </Select>
      </div>

      <Input type="number" name="fees" step="0.01" min="0" fallback="0" />

      {/* The conversion rate is only relevant when moving money across jars with different currencies */}
      {fromJar?.currency !== toJar?.currency && (
        <Input
          type="number"
          name="conversionRate"
          step="any"
          min="0.01"
          fallback="1"
        />
      )}

      <AddTransactionSubmitButton />
    </form>
  )
}

export { NewTransactionForms }
