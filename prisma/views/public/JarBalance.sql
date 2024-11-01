SELECT
  bu."jarId",
  COALESCE((sum(bu.amount)) :: integer, 0) AS balance
FROM
  "JarBalanceUpdate" bu
GROUP BY
  bu."jarId";