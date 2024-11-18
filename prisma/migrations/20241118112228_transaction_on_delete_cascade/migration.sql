-- DropForeignKey
ALTER TABLE "InitTransaction" DROP CONSTRAINT "InitTransaction_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "MovedTransaction" DROP CONSTRAINT "MovedTransaction_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "ReceivedTransaction" DROP CONSTRAINT "ReceivedTransaction_transactionId_fkey";

-- DropForeignKey
ALTER TABLE "SentTransaction" DROP CONSTRAINT "SentTransaction_transactionId_fkey";

-- AddForeignKey
ALTER TABLE "InitTransaction" ADD CONSTRAINT "InitTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentTransaction" ADD CONSTRAINT "SentTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivedTransaction" ADD CONSTRAINT "ReceivedTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovedTransaction" ADD CONSTRAINT "MovedTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE CASCADE ON UPDATE CASCADE;
