-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'INIT';

-- CreateTable
CREATE TABLE "InitTransaction" (
    "transactionId" UUID NOT NULL,
    "jarId" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "InitTransaction_pkey" PRIMARY KEY ("transactionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "InitTransaction_transactionId_key" ON "InitTransaction"("transactionId");

-- CreateIndex
CREATE UNIQUE INDEX "InitTransaction_jarId_key" ON "InitTransaction"("jarId");

-- AddForeignKey
ALTER TABLE "InitTransaction" ADD CONSTRAINT "InitTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InitTransaction" ADD CONSTRAINT "InitTransaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
