-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'ARS', 'EUR');

-- CreateEnum
CREATE TYPE "TransactionType" AS ENUM ('INIT', 'SENT', 'RECEIVED', 'MOVED');

-- CreateTable
CREATE TABLE "Jar" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transaction" (
    "id" UUID NOT NULL,
    "type" "TransactionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InitTransaction" (
    "transactionId" UUID NOT NULL,
    "jarId" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InitTransaction_pkey" PRIMARY KEY ("transactionId")
);

-- CreateTable
CREATE TABLE "SentTransaction" (
    "transactionId" UUID NOT NULL,
    "jarId" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "counterparty" TEXT NOT NULL,

    CONSTRAINT "SentTransaction_pkey" PRIMARY KEY ("transactionId")
);

-- CreateTable
CREATE TABLE "ReceivedTransaction" (
    "transactionId" UUID NOT NULL,
    "jarId" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "counterparty" TEXT NOT NULL,

    CONSTRAINT "ReceivedTransaction_pkey" PRIMARY KEY ("transactionId")
);

-- CreateTable
CREATE TABLE "MovedTransaction" (
    "transactionId" UUID NOT NULL,
    "fromJarId" UUID NOT NULL,
    "fromAmount" INTEGER NOT NULL DEFAULT 0,
    "toJarId" UUID NOT NULL,
    "toAmount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MovedTransaction_pkey" PRIMARY KEY ("transactionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "InitTransaction_transactionId_key" ON "InitTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "InitTransaction_jarId_key" ON "InitTransaction"("jarId");

-- CreateIndex
CREATE UNIQUE INDEX "SentTransaction_transactionId_key" ON "SentTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "ReceivedTransaction_transactionId_key" ON "ReceivedTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "MovedTransaction_transactionId_key" ON "MovedTransaction"("transactionId");

-- AddForeignKey
ALTER TABLE "InitTransaction" ADD CONSTRAINT "InitTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InitTransaction" ADD CONSTRAINT "InitTransaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentTransaction" ADD CONSTRAINT "SentTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentTransaction" ADD CONSTRAINT "SentTransaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivedTransaction" ADD CONSTRAINT "ReceivedTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivedTransaction" ADD CONSTRAINT "ReceivedTransaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovedTransaction" ADD CONSTRAINT "MovedTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovedTransaction" ADD CONSTRAINT "MovedTransaction_fromJarId_fkey" FOREIGN KEY ("fromJarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovedTransaction" ADD CONSTRAINT "MovedTransaction_toJarId_fkey" FOREIGN KEY ("toJarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
