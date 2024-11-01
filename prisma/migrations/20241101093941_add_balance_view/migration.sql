CREATE VIEW "JarBalance" AS
SELECT
  bu."jarId" AS "jarId",
  COALESCE(SUM(bu.amount), 0) AS balance
FROM
  "JarBalanceUpdate" bu
GROUP BY
  bu."jarId";