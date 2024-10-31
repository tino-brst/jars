CREATE VIEW "JarBalanceUpdate" AS

-- Sent transactions

SELECT
  st."jarId" AS "jarId",
  st."amount" AS amount
FROM
  "SentTransaction" st

UNION ALL

-- Received transactions

SELECT
  rt."jarId" AS "jarId",
  rt."amount" AS amount
FROM
  "ReceivedTransaction" rt

UNION ALL

-- Move transactions

SELECT
  mt."fromJarId" AS "jarId",
  mt."fromAmount" AS amount
FROM
  "MoveTransaction" mt

UNION ALL

SELECT
  mt."toJarId" AS "jarId",
  mt."toAmount" AS amount
FROM
  "MoveTransaction" mt;