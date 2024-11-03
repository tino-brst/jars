'use client'

import { useState } from 'react'

import {
  createMovedTransaction,
  createSentOrReceivedTransaction,
} from '@/actions/transactions'
import { AddTransactionSubmitButton } from '@/components/AddTransactionSubmitButton'

import { Input } from '@/components/primitives/Input'
import { Select } from '@/components/primitives/Select'
import { JarWithBalance, TransactionType } from '@prisma/client'

function NewTransactionForms({ jars }: { jars: Array<JarWithBalance> }) {
  const [transactionType, setTransactionType] = useState<TransactionType>(
    TransactionType.SENT,
  )

  const hasMultipleJars = jars.length > 1

  return (
    <div className="mb-6 flex flex-col gap-2">
      <Select
        value={transactionType}
        onChange={(event) =>
          setTransactionType(event.target.value as TransactionType)
        }
      >
        <option value={TransactionType.SENT}>Sent</option>
        <option value={TransactionType.RECEIVED}>Received</option>
        {hasMultipleJars ? (
          <option value={TransactionType.MOVED}>Moved</option>
        ) : (
          <optgroup label="Needs at least two jars">
            <option value={TransactionType.MOVED} disabled>
              Moved
            </option>
          </optgroup>
        )}
      </Select>

      {(transactionType === 'SENT' || transactionType === 'RECEIVED') && (
        <SentOrReceivedTransactionForm
          jars={jars}
          transactionType={transactionType}
        />
      )}

      {transactionType === 'MOVED' && <MovedTransactionForm jars={jars} />}
    </div>
  )
}

function SentOrReceivedTransactionForm({
  jars,
  transactionType,
}: {
  jars: Array<JarWithBalance>
  transactionType: TransactionType
}) {
  return (
    <form
      className="flex flex-col gap-2"
      action={createSentOrReceivedTransaction}
    >
      <input type="hidden" value={transactionType} name="type" />

      <div className="flex items-center gap-2">
        <Input
          required
          type="text"
          name="counterparty"
          placeholder={transactionType === 'SENT' ? 'to' : 'from'}
          className="flex-1"
        />
        <p>{transactionType === 'SENT' ? 'from' : 'to'}</p>
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
  )
}

function MovedTransactionForm({ jars }: { jars: Array<JarWithBalance> }) {
  const [fromJarId, setFromJarId] = useState<string>(jars[0].id ?? '')
  const [toJarId, setToJarId] = useState<string>(jars[1].id ?? '')

  const fromJar = jars.find((jar) => jar.id === fromJarId)
  const toJar = jars.find((jar) => jar.id === toJarId)

  return (
    <form className="flex flex-col gap-2" action={createMovedTransaction}>
      <div className="flex items-center gap-2">
        <Input
          required
          type="number"
          name="fromAmount"
          placeholder={`fromAmount (${(fromJar?.balance ?? 0) / 100})`}
          step="0.01"
          min="0"
          max={(fromJar?.balance ?? 0) / 100}
          className="flex-1"
        />
        <Select
          required
          name="fromJarId"
          value={fromJarId}
          onChange={(event) => setFromJarId(event.target.value)}
        >
          {/* TODO split options in non-empty & empty jars, with the empty ones disabled */}
          {jars.map((jar) => (
            <option value={jar.id} key={jar.id}>
              {jar.name} ({jar.currency})
            </option>
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
          name="toJarId"
          value={toJarId}
          onChange={(event) => setToJarId(event.target.value)}
        >
          {jars.map((jar) => (
            <option value={jar.id} key={jar.id}>
              {jar.name} ({jar.currency})
            </option>
          ))}
        </Select>
      </div>

      <Input type="number" name="fee" step="0.01" min="0" />

      {/* The conversion rate is only relevant when moving money across jars with different currencies */}
      {fromJar?.currency !== toJar?.currency && (
        <Input type="number" name="conversionRate" step="any" min="0" />
      )}

      <AddTransactionSubmitButton />
    </form>
  )
}

export { NewTransactionForms }
