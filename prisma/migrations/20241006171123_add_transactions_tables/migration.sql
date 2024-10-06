/*
  Warnings:

  - The primary key for the `Jar` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `id` on the `Jar` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('SENT', 'RECEIVED');

-- AlterTable
ALTER TABLE "Jar" DROP CONSTRAINT "Jar_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
ADD CONSTRAINT "Jar_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "jarId" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SentTransaction" (
    "id" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "counterparty" TEXT NOT NULL,

    CONSTRAINT "SentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReceivedTransaction" (
    "id" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "counterparty" TEXT NOT NULL,

    CONSTRAINT "ReceivedTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SentTransaction_transactionId_key" ON "SentTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ReceivedTransaction_transactionId_key" ON "ReceivedTransaction"("transactionId");

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentTransaction" ADD CONSTRAINT "SentTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivedTransaction" ADD CONSTRAINT "ReceivedTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
