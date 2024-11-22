/*
  Warnings:

  - Added the required column `accountId` to the `Jar` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Jar" ADD COLUMN     "accountId" UUID NOT NULL,
ADD COLUMN     "isPrimary" BOOLEAN NOT NULL DEFAULT false;

-- AddForeignKey
ALTER TABLE "Jar" ADD CONSTRAINT "Jar_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Account"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
