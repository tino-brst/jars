-- CreateTable
CREATE TABLE "MoveTransaction" (
    "id" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "amount" INTEGER NOT NULL DEFAULT 0,
    "toJarId" UUID NOT NULL,
    "toAmount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "MoveTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MoveTransaction_transactionId_key" ON "MoveTransaction"("transactionId");

-- AddForeignKey
ALTER TABLE "MoveTransaction" ADD CONSTRAINT "MoveTransaction_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "Transaction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
