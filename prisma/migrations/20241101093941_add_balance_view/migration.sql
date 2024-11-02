CREATE VIEW "JarBalance" AS
SELECT
  bu."jarId" AS "jarId",
  SUM(bu.amount) :: INT AS balance
FROM
  "JarBalanceUpdate" bu
GROUP BY
  bu."jarId";