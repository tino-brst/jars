'use client'

import { useState } from 'react'

import {
  createMovedTransaction,
  createSentTransaction,
  createReceivedTransaction,
  createDebitCardTransaction,
} from '@/actions/transactions'
import { AddTransactionSubmitButton } from '@/components/AddTransactionSubmitButton'

import { Input } from '@/components/primitives/Input'
import { Select } from '@/components/primitives/Select'
import { Account, Card, JarWithBalance, TransactionType } from '@prisma/client'
import { FormContainer } from './FormContainer'

// TODO clear inputs after submit (I think this already works?)
// TODO stricter ts, array[number]: something | undefined

// TODO ✋ probably the balance checks to enable/disable transactions don't make
// much sense. Same for max={} on the inputs. What if I wanna add a transaction
// that happened in the past? I should be able to do that, even if the jar is
// empty now. It's useful to have the current balances on the inputs though.
// WAIT, maybe I can keep the check for max values, unless it has Custom Date
// enabled, in which case the max restriction is removed

function NewTransactionForms({
  accounts,
  jars,
  cards,
}: {
  accounts: Array<Account>
  jars: Array<JarWithBalance>
  cards: Array<Card>
}) {
  const hasNonEmptyJars = jars.some((jar) => jar.balance > 0)
  const hasMoreThanOneJar = jars.length > 1

  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.DEBIT_CARD,
  )

  return (
    <FormContainer title="New Transaction">
      <div className="flex flex-col gap-2">
        <Select
          value={transactionType}
          onChange={(event) =>
            setTransactionType(event.target.value as TransactionType)
          }
        >
          <option value={TransactionType.DEBIT_CARD}>Debit Card</option>
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

        {transactionType === 'DEBIT_CARD' && (
          <DebitCardTransactionForm
            accounts={accounts}
            jars={jars}
            cards={cards}
          />
        )}

        {transactionType === 'SENT' && (
          <SentTransactionForm accounts={accounts} jars={jars} />
        )}

        {transactionType === 'RECEIVED' && (
          <ReceivedTransactionForm accounts={accounts} jars={jars} />
        )}

        {transactionType === 'MOVED' && (
          <MovedTransactionForm accounts={accounts} jars={jars} />
        )}
      </div>
    </FormContainer>
  )
}

function DebitCardTransactionForm({
  accounts,
  jars,
  cards,
}: {
  accounts: Array<Account>
  jars: Array<JarWithBalance>
  cards: Array<Card>
}) {
  const [selectedCardId, setSelectedCardId] = useState<string>(cards[0].id)
  const selectedCard = cards.find((card) => card.id === selectedCardId)

  const availableCurrencies =
    jars
      .filter((jar) => jar.accountId === selectedCard?.accountId)
      .filter((jar) => jar.isPrimary)
      .map((jar) => jar.currency) ?? []

  const accountsWithCards = accounts
    .map((account) => ({
      ...account,
      cards: cards.filter((card) => card.accountId === account.id),
    }))
    .filter((account) => account.cards.length > 0)

  return (
    <form className="flex flex-col gap-2" action={createDebitCardTransaction}>
      <Select
        required
        name="cardId"
        value={selectedCardId}
        onChange={(event) => setSelectedCardId(event.target.value)}
      >
        {accountsWithCards.map((account) => (
          <optgroup key={account.id} label={account.name}>
            {account.cards.map((card) => (
              <option key={card.id} value={card.id}>
                {account.name} / •••• {card.lastFourDigits}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
      <Input required type="text" name="description" />
      <div className="flex items-center gap-2">
        <Input
          required
          type="number"
          name="amount"
          step="0.01"
          min="0.01"
          className="flex-1"
        />
        <Select required name="currency" className="flex-1">
          {availableCurrencies.map((currency) => (
            <option key={currency} value={currency}>
              {currency}
            </option>
          ))}
        </Select>
      </div>

      <AddTransactionSubmitButton />
    </form>
  )
}

function SentTransactionForm({
  accounts,
  jars,
}: {
  accounts: Array<Account>
  jars: Array<JarWithBalance>
}) {
  const firstNonEmptyJar = jars.find((jar) => jar.balance > 0)
  const [jarId, setJarId] = useState(firstNonEmptyJar?.id)
  const jar = jars.find((jar) => jar.id === jarId)

  const accountsWithJars = accounts
    .map((account) => ({
      ...account,
      jars: jars.filter((jar) => jar.accountId === account.id),
    }))
    .filter((account) => account.jars.length > 0)

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
        from
        <Select
          required
          name="jarId"
          className="flex-1"
          value={jarId}
          onChange={(event) => setJarId(event.target.value)}
        >
          {accountsWithJars.map((account) => (
            <optgroup key={account.id} label={account.name}>
              {account.jars.map((jar) => (
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
  jars,
}: {
  accounts: Array<Account>
  jars: Array<JarWithBalance>
}) {
  const accountsWithJars = accounts
    .map((account) => ({
      ...account,
      jars: jars.filter((jar) => jar.accountId === account.id),
    }))
    .filter((account) => account.jars.length > 0)

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
        to
        <Select required name="jarId" className="flex-1">
          {accountsWithJars.map((account) => (
            <optgroup key={account.id} label={account.name}>
              {account.jars.map((jar) => (
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
  jars,
}: {
  accounts: Array<Account>
  jars: Array<JarWithBalance>
}) {
  // TODO 🐛 if the transaction empties the source jar, the form is reset after
  // submission but the from & to selects are set to the same jar. Actually,
  // looks like any transactions resets the selects to the first jar (even if
  // disabled)

  const accountsWithJars = accounts
    .map((account) => ({
      ...account,
      jars: jars.filter((jar) => jar.accountId === account.id),
    }))
    .filter((account) => account.jars.length > 0)

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
              {account.jars.map((jar) => (
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
              {account.jars.map((jar) => (
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
