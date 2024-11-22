CREATE UNIQUE INDEX unique_primary_jar_per_currency
ON "Jar" ("accountId", "currency")
WHERE "isPrimary" = TRUE;