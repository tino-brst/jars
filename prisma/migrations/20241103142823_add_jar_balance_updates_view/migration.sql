CREATE VIEW "JarBalanceUpdate" AS

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

-- Move transactions

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