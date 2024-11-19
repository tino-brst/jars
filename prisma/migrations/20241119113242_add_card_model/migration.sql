-- CreateEnum
CREATE TYPE "CardType" AS ENUM ('DEBIT', 'CREDIT');

-- CreateEnum
CREATE TYPE "CardIssuer" AS ENUM ('VISA', 'MASTERCARD');

-- CreateTable
CREATE TABLE "Card" (
    "id" UUID NOT NULL,
    "jarId" UUID NOT NULL,
    "type" "CardType" NOT NULL,
    "issuer" "CardIssuer" NOT NULL,
    "lastFourDigits" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Card_jarId_key" ON "Card"("jarId");

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_jarId_fkey" FOREIGN KEY ("jarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
