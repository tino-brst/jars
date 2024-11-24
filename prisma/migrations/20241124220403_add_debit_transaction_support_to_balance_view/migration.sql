CREATE OR REPLACE VIEW "JarBalanceUpdate" AS

-- Init transactions

SELECT
  it."transactionId" AS "transactionId",
  it."jarId" AS "jarId",
  it."amount" AS amount
FROM
  "InitTransaction" it

UNION ALL

-- Debit transactions

SELECT
  dt."transactionId" AS "transactionId",
  dt."jarId" AS "jarId",
  dt."amount" AS amount
FROM
  "DebitTransaction" dt

UNION ALL

-- Sent transactions

SELECT
  st."transactionId" AS "transactionId",
  st."jarId" AS "jarId",
  st."amount" AS amount
FROM
  "SentTransaction" st

UNION ALL

-- Received transactions

SELECT
  rt."transactionId" AS "transactionId",
  rt."jarId" AS "jarId",
  rt."amount" AS amount
FROM
  "ReceivedTransaction" rt

UNION ALL

-- Moved transactions

SELECT
  mt."transactionId" AS "transactionId",
  mt."fromJarId" AS "jarId",
  mt."fromAmount" AS amount
FROM
  "MovedTransaction" mt

UNION ALL

SELECT
  mt."transactionId" AS "transactionId",
  mt."toJarId" AS "jarId",
  mt."toAmount" AS amount
FROM
  "MovedTransaction" mt;