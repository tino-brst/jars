/*
  Warnings:

  - You are about to drop the `CardJar` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CardJar" DROP CONSTRAINT "CardJar_cardId_fkey";

-- DropForeignKey
ALTER TABLE "CardJar" DROP CONSTRAINT "CardJar_jarId_jarCurrency_fkey";

-- DropIndex
DROP INDEX "Jar_id_currency_key";

-- DropTable
DROP TABLE "CardJar";
