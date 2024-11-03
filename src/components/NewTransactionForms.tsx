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
import { JarWithBalance, TransactionType } from '@prisma/client'

// TODO clear inputs after submit
// TODO all transaction inputs have to be > 0 (min="0" is inclusive of zero)

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
          <>
            <hr />
            <optgroup label="Needs at least two jars">
              <option value={TransactionType.MOVED} disabled>
                Moved
              </option>
            </optgroup>
          </>
        )}
      </Select>

      {transactionType === 'SENT' && <SentTransactionForm jars={jars} />}

      {transactionType === 'RECEIVED' && (
        <ReceivedTransactionForm jars={jars} />
      )}

      {transactionType === 'MOVED' && <MovedTransactionForm jars={jars} />}
    </div>
  )
}

function SentTransactionForm({ jars }: { jars: Array<JarWithBalance> }) {
  const nonEmptyJars = jars.filter((jar) => jar.balance > 0)
  const emptyJars = jars.filter((jar) => jar.balance === 0)

  const [jarId, setJarId] = useState(nonEmptyJars[0].id ?? '')
  const jar = jars.find((jar) => jar.id === jarId)

  return (
    <form className="flex flex-col gap-2" action={createSentTransaction}>
      <Input
        required
        type="number"
        name="amount"
        step="0.01"
        min="0"
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
          {nonEmptyJars.map((jar) => (
            <option value={jar.id} key={jar.id}>
              {jar.name} ({jar.currency})
            </option>
          ))}

          {!!emptyJars.length && (
            <>
              <hr />
              <optgroup label="Empty jars">
                {emptyJars.map((jar) => (
                  <option value={jar.id} key={jar.id} disabled>
                    {jar.name} ({jar.currency})
                  </option>
                ))}
              </optgroup>
            </>
          )}
        </Select>
      </div>

      <AddTransactionSubmitButton />
    </form>
  )
}

function ReceivedTransactionForm({ jars }: { jars: Array<JarWithBalance> }) {
  return (
    <form className="flex flex-col gap-2" action={createReceivedTransaction}>
      <Input
        required
        type="number"
        name="amount"
        step="0.01"
        min="0"
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
          {jars.map((jar) => (
            <option value={jar.id} key={jar.id}>
              {jar.name} ({jar.currency})
            </option>
          ))}
        </Select>
      </div>

      <AddTransactionSubmitButton />
    </form>
  )
}

function MovedTransactionForm({ jars }: { jars: Array<JarWithBalance> }) {
  const nonEmptyJars = jars.filter((jar) => jar.balance > 0)
  const emptyJars = jars.filter((jar) => jar.balance === 0)

  const [fromJarId, setFromJarId] = useState<string>(nonEmptyJars[0].id ?? '')
  const fromJar = jars.find((jar) => jar.id === fromJarId)
  const jarsWithoutFromJar = jars.filter((jar) => jar.id !== fromJarId)

  const [toJarId, setToJarId] = useState<string>(jarsWithoutFromJar[0].id ?? '')
  const toJar = jars.find((jar) => jar.id === toJarId)
  const nonEmptyJarsWithoutToJar = nonEmptyJars.filter(
    (jar) => jar.id !== toJarId,
  )

  const isToJarEmpty = !toJar?.balance

  return (
    <form className="flex flex-col gap-2" action={createMovedTransaction}>
      <div className="flex items-center gap-2">
        <Input
          required
          type="number"
          name="fromAmount"
          step="0.01"
          min="0"
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
          {nonEmptyJarsWithoutToJar.map((jar) => (
            <option value={jar.id} key={jar.id}>
              {jar.name} ({jar.currency})
            </option>
          ))}

          {!isToJarEmpty && (
            <>
              <hr />
              <optgroup label="Swap">
                <option value={toJar.id} key={toJar.id}>
                  {toJar.name} ({toJar.currency})
                </option>
              </optgroup>
            </>
          )}

          {!!emptyJars.length && (
            <>
              <hr />
              <optgroup label="Empty jars">
                {emptyJars.map((jar) => (
                  <option value={jar.id} key={jar.id} disabled>
                    {jar.name} ({jar.currency})
                  </option>
                ))}
              </optgroup>
            </>
          )}
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
          {jarsWithoutFromJar.map((jar) => (
            <option value={jar.id} key={jar.id}>
              {jar.name} ({jar.currency})
            </option>
          ))}
          {!!fromJar && (
            <>
              <hr />
              <optgroup label="Swap">
                <option
                  value={fromJar.id}
                  key={fromJar.id}
                  // Swapping jars should only be possible if the current toJar
                  // has a non-empty balance
                  disabled={isToJarEmpty}
                >
                  {fromJar.name} ({fromJar.currency})
                </option>
              </optgroup>
            </>
          )}
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
