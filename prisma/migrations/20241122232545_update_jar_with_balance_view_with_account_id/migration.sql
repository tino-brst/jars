-- Drop the existing view
DROP VIEW IF EXISTS "JarWithBalance";

-- Create the updated view with accountId
CREATE VIEW "JarWithBalance" AS
SELECT
  j.id,
  j.name,
  j.currency,
  j."createdAt",
  j."updatedAt",
  j."accountId",
  COALESCE(b.balance, 0) AS balance
FROM
  "Jar" j
  LEFT JOIN "JarBalance" b ON j.id = b."jarId";