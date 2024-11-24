-- AlterEnum
ALTER TYPE "TransactionType" ADD VALUE 'DEBIT';

-- CreateTable
CREATE TABLE "DebitTransaction" (
    "transactionId" UUID NOT NULL,
    "cardId" UUID NOT NULL,
    "jarId" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "description" TEXT,

    CONSTRAINT "DebitTransaction_pkey" PRIMARY KEY ("transactionId")
);

-- CreateIndex
CREATE UNIQUE INDEX "DebitTransaction_transactionId_key" ON "DebitTransaction"("transactionId");

-- AddForeignKey
ALTER TABLE "DebitTransaction" ADD CONSTRAINT "DebitTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebitTransaction" ADD CONSTRAINT "DebitTransaction_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DebitTransaction" ADD CONSTRAINT "DebitTransaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
