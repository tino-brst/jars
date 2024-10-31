/*
  Warnings:

  - You are about to drop the column `amount` on the `MoveTransaction` table. All the data in the column will be lost.
  - Added the required column `fromJarId` to the `MoveTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jarId` to the `ReceivedTransaction` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jarId` to the `SentTransaction` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_jarId_fkey";

-- AlterTable
ALTER TABLE "MoveTransaction" DROP COLUMN "amount",
ADD COLUMN     "fromAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "fromJarId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "ReceivedTransaction" ADD COLUMN     "jarId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "SentTransaction" ADD COLUMN     "jarId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "jarId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Transaction" ADD CONSTRAINT "Transaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SentTransaction" ADD CONSTRAINT "SentTransaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReceivedTransaction" ADD CONSTRAINT "ReceivedTransaction_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
