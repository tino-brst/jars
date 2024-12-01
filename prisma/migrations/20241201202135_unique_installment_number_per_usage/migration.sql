/*
  Warnings:

  - A unique constraint covering the columns `[cardId,usageId,installmentNumber]` on the table `CreditCardTransaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CreditCardTransaction_cardId_usageId_installmentNumber_key" ON "CreditCardTransaction"("cardId", "usageId", "installmentNumber");
