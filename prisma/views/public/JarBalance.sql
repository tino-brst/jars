SELECT
  bu."jarId",
  (sum(bu.amount)) :: integer AS balance
FROM
  "JarBalanceUpdate" bu
GROUP BY
  bu."jarId";