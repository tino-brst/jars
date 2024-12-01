SELECT
  it."transactionId",
  it."jarId",
  it.amount
FROM
  "InitTransaction" it
UNION
ALL
SELECT
  dct."transactionId",
  dct."jarId",
  dct.amount
FROM
  "DebitCardTransaction" dct
UNION
ALL
SELECT
  st."transactionId",
  st."jarId",
  st.amount
FROM
  "SentTransaction" st
UNION
ALL
SELECT
  rt."transactionId",
  rt."jarId",
  rt.amount
FROM
  "ReceivedTransaction" rt
UNION
ALL
SELECT
  mt."transactionId",
  mt."fromJarId" AS "jarId",
  mt."fromAmount" AS amount
FROM
  "MovedTransaction" mt
UNION
ALL
SELECT
  mt."transactionId",
  mt."toJarId" AS "jarId",
  mt."toAmount" AS amount
FROM
  "MovedTransaction" mt;