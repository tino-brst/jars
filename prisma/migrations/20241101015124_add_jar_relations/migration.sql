-- AddForeignKey
ALTER TABLE "MoveTransaction" ADD CONSTRAINT "MoveTransaction_fromJarId_fkey" FOREIGN KEY ("fromJarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MoveTransaction" ADD CONSTRAINT "MoveTransaction_toJarId_fkey" FOREIGN KEY ("toJarId") REFERENCES "Jar"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
