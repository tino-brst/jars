/*
  Warnings:

  - The primary key for the `MoveTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `MoveTransaction` table. All the data in the column will be lost.
  - The primary key for the `ReceivedTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `ReceivedTransaction` table. All the data in the column will be lost.
  - The primary key for the `SentTransaction` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `SentTransaction` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "MoveTransaction" DROP CONSTRAINT "MoveTransaction_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "MoveTransaction_pkey" PRIMARY KEY ("transactionId");

-- AlterTable
ALTER TABLE "ReceivedTransaction" DROP CONSTRAINT "ReceivedTransaction_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "ReceivedTransaction_pkey" PRIMARY KEY ("transactionId");

-- AlterTable
ALTER TABLE "SentTransaction" DROP CONSTRAINT "SentTransaction_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "SentTransaction_pkey" PRIMARY KEY ("transactionId");
