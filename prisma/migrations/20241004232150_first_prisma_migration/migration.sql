-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('USD', 'ARS', 'EUR');

-- CreateTable
CREATE TABLE "Jar" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "balance" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jar_pkey" PRIMARY KEY ("id")
);
