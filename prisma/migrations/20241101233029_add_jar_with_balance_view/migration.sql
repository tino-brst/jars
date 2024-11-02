CREATE VIEW "JarWithBalance" AS
SELECT
  j.id AS "id",
  j.name AS "name",
  j.currency AS "currency",
  j."createdAt" AS "createdAt",
  j."updatedAt" AS "updatedAt",
  COALESCE(b.balance, 0) AS "balance"
FROM
  "Jar" j
LEFT JOIN
  "JarBalance" b ON j.id = b."jarId";