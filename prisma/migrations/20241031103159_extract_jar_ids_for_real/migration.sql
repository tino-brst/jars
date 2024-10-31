/*
  Warnings:

  - You are about to drop the column `jarId` on the `Transaction` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Transaction" DROP CONSTRAINT "Transaction_jarId_fkey";

-- AlterTable
ALTER TABLE "Transaction" DROP COLUMN "jarId";
