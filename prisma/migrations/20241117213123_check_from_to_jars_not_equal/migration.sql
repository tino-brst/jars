ALTER TABLE "MovedTransaction"
ADD CONSTRAINT "check_from_to_jars_not_equal"
CHECK ("fromJarId" <> "toJarId");