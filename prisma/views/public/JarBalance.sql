SELECT
  bu."jarId",
  COALESCE(sum(bu.amount), (0) :: bigint) AS balance
FROM
  "JarBalanceUpdate" bu
GROUP BY
  bu."jarId";