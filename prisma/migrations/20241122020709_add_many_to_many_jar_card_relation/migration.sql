/*
  Warnings:

  - A unique constraint covering the columns `[id,currency]` on the table `Jar` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "CardJar" (
    "cardId" UUID NOT NULL,
    "jarId" UUID NOT NULL,
    "jarCurrency" "Currency" NOT NULL,

    CONSTRAINT "CardJar_pkey" PRIMARY KEY ("cardId","jarId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CardJar_cardId_jarCurrency_key" ON "CardJar"("cardId", "jarCurrency");

-- CreateIndex
CREATE UNIQUE INDEX "Jar_id_currency_key" ON "Jar"("id", "currency");

-- AddForeignKey
ALTER TABLE "CardJar" ADD CONSTRAINT "CardJar_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardJar" ADD CONSTRAINT "CardJar_jarId_jarCurrency_fkey" FOREIGN KEY ("jarId", "jarCurrency") REFERENCES "Jar"("id", "currency") ON DELETE RESTRICT ON UPDATE CASCADE;
