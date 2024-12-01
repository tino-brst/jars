-- CreateEnum
CREATE TYPE "CreditCardUsageType" AS ENUM ('INSTALLMENTS', 'SUBSCRIPTION');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "TransactionType" ADD VALUE 'CREDIT_CARD';
ALTER TYPE "TransactionType" ADD VALUE 'CREDIT_CARD_SETTLED';

-- CreateTable
CREATE TABLE "CreditCardUsage" (
    "id" UUID NOT NULL,
    "cardId" UUID NOT NULL,
    "type" "CreditCardUsageType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "currency" "Currency" NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "CreditCardUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditCardInstallmentsUsage" (
    "usageId" UUID NOT NULL,
    "installmentsCount" INTEGER NOT NULL,

    CONSTRAINT "CreditCardInstallmentsUsage_pkey" PRIMARY KEY ("usageId")
);

-- CreateTable
CREATE TABLE "CreditCardSubscriptionUsage" (
    "usageId" UUID NOT NULL,
    "active" BOOLEAN NOT NULL,

    CONSTRAINT "CreditCardSubscriptionUsage_pkey" PRIMARY KEY ("usageId")
);

-- CreateTable
CREATE TABLE "CreditCardTransaction" (
    "transactionId" UUID NOT NULL,
    "cardId" UUID NOT NULL,
    "usageId" UUID NOT NULL,
    "originalAmount" INTEGER NOT NULL,
    "originalCurrency" "Currency" NOT NULL,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "installmentNumber" INTEGER,
    "settledByTransactionId" UUID,
    "jarId" UUID,
    "amount" INTEGER,
    "conversionRate" DOUBLE PRECISION,

    CONSTRAINT "CreditCardTransaction_pkey" PRIMARY KEY ("transactionId")
);

-- CreateTable
CREATE TABLE "CreditCardSettledTransaction" (
    "transactionId" UUID NOT NULL,
    "cardId" UUID NOT NULL,
    "jarId" UUID NOT NULL,
    "amount" INTEGER NOT NULL,
    "statementClosedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditCardSettledTransaction_pkey" PRIMARY KEY ("transactionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CreditCardTransaction_transactionId_key" ON "CreditCardTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCardTransaction_settledByTransactionId_key" ON "CreditCardTransaction"("settledByTransactionId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditCardSettledTransaction_transactionId_key" ON "CreditCardSettledTransaction"("transactionId");

-- AddForeignKey
ALTER TABLE "CreditCardUsage" ADD CONSTRAINT "CreditCardUsage_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardInstallmentsUsage" ADD CONSTRAINT "CreditCardInstallmentsUsage_usageId_fkey" FOREIGN KEY ("usageId") REFERENCES "CreditCardUsage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardSubscriptionUsage" ADD CONSTRAINT "CreditCardSubscriptionUsage_usageId_fkey" FOREIGN KEY ("usageId") REFERENCES "CreditCardUsage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardTransaction" ADD CONSTRAINT "CreditCardTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardTransaction" ADD CONSTRAINT "CreditCardTransaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardTransaction" ADD CONSTRAINT "CreditCardTransaction_usageId_fkey" FOREIGN KEY ("usageId") REFERENCES "CreditCardUsage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardTransaction" ADD CONSTRAINT "CreditCardTransaction_settledByTransactionId_fkey" FOREIGN KEY ("settledByTransactionId") REFERENCES "CreditCardSettledTransaction"("transactionId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardTransaction" ADD CONSTRAINT "CreditCardTransaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardSettledTransaction" ADD CONSTRAINT "CreditCardSettledTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardSettledTransaction" ADD CONSTRAINT "CreditCardSettledTransaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CreditCardSettledTransaction" ADD CONSTRAINT "CreditCardSettledTransaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
