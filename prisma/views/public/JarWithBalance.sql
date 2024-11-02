SELECT
  j.id,
  j.name,
  j.currency,
  j."createdAt",
  j."updatedAt",
  COALESCE(b.balance, 0) AS balance
FROM
  (
    "Jar" j
    LEFT JOIN "JarBalance" b ON ((j.id = b."jarId"))
  );