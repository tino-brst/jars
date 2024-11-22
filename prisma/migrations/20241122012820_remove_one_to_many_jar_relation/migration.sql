/*
  Warnings:

  - You are about to drop the column `jarId` on the `Card` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_jarId_fkey";

-- AlterTable
ALTER TABLE "Card" DROP COLUMN "jarId";
