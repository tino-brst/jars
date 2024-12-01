-- Drop views

DROP VIEW "JarWithBalance";
DROP VIEW "JarBalance";
DROP VIEW "JarBalanceUpdate";

-- Drop DebitTransaction table

-- DropForeignKey
ALTER TABLE "DebitTransaction" DROP CONSTRAINT "DebitTransaction_cardId_fkey";

-- DropForeignKey
ALTER TABLE "DebitTransaction" DROP CONSTRAINT "DebitTransaction_jarId_fkey";

-- DropForeignKey
ALTER TABLE "DebitTransaction" DROP CONSTRAINT "DebitTransaction_transactionId_fkey";

-- DropTable
DROP TABLE "DebitTransaction";

-- CreateTable
CREATE TABLE "DebitCardTransaction" (
    "transactionId" UUID NOT NULL,
    "cardId" UUID NOT NULL,
    "jarId" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,

    CONSTRAINT "DebitCardTransaction_pkey" PRIMARY KEY ("transactionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DebitCardTransaction_transactionId_key" ON "DebitCardTransaction"("transactionId");

-- AddForeignKey
ALTER TABLE "DebitCardTransaction" ADD CONSTRAINT "DebitCardTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebitCardTransaction" ADD CONSTRAINT "DebitCardTransaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebitCardTransaction" ADD CONSTRAINT "DebitCardTransaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- Recreate views

CREATE VIEW "JarBalanceUpdate" AS

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
  dct."transactionId" AS "transactionId",
  dct."jarId" AS "jarId",
  dct."amount" AS amount
FROM
  "DebitCardTransaction" dct

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

CREATE VIEW "JarBalance" AS
SELECT
  bu."jarId" AS "jarId",
  SUM(bu.amount) :: INT AS balance
FROM
  "JarBalanceUpdate" bu
GROUP BY
  bu."jarId";

CREATE VIEW "JarWithBalance" AS
SELECT
  j.id,
  j.name,
  j.currency,
  j."createdAt",
  j."updatedAt",
  j."accountId",
  j."isPrimary",
  COALESCE(b.balance, 0) AS balance
FROM
  (
    "Jar" j
    LEFT JOIN "JarBalance" b ON ((j.id = b."jarId"))
  );