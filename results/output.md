# PostgreSQL & SQLite Driver Benchmarks

- Node: v24.9.0
- PostgreSQL: 17.5

---

## 1. Import Overhead

30 iterations, fresh Node process each time

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite | raw | 5.56ms | 5.47ms | 6.07ms | 4.3% | - |
| 2 | sqlite-drizzle | orm | 262.94ms | 230.77ms | 277.07ms | 11.9% | +4627% |
| 3 | pg | raw | 17.08ms | 14.00ms | 19.28ms | 14.0% | - |
| 4 | pg-drizzle | orm | 280.32ms | 247.62ms | 302.22ms | 6.4% | +1541% |
| 5 | postgres | raw | 15.13ms | 13.89ms | 17.10ms | 10.0% | - |
| 6 | postgres-drizzle | orm | 280.06ms | 247.33ms | 326.15ms | 9.3% | +1751% |
| 7 | pglite | raw | 12.09ms | 11.83ms | 13.07ms | 3.7% | - |
| 8 | pglite-drizzle | orm | 279.33ms | 244.65ms | 285.03ms | 2.9% | +2210% |

---

## 2. Cold Start Connection

30 iterations, fresh connection each time (connect + query)

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 1.62ms | 1.57ms | 1.73ms | 3.7% | - |
| 2 | sqlite-memory-drizzle | orm | 2.75ms | 2.44ms | 2.82ms | 4.2% | +70% |
| 3 | sqlite-fs | raw | 1.70ms | 1.61ms | 1.80ms | 4.2% | - |
| 4 | sqlite-fs-drizzle | orm | 2.63ms | 2.55ms | 2.67ms | 1.0% | +55% |
| 5 | pg | raw | 8.76ms | 8.44ms | 9.31ms | 2.9% | - |
| 6 | pg-drizzle | orm | 12.10ms | 10.86ms | 12.66ms | 4.0% | +38% |
| 7 | postgres | raw | 13.39ms | 12.78ms | 13.80ms | 4.3% | - |
| 8 | postgres-drizzle | orm | 14.21ms | 12.76ms | 16.19ms | 7.9% | +6% |
| 9 | pglite-memory | raw | 714.52ms | 644.79ms | 744.18ms | 4.3% | - |
| 10 | pglite-memory-drizzle | orm | 710.12ms | 641.28ms | 737.56ms | 4.3% | -1% |
| 11 | pglite-fs | raw | 931.29ms | 829.64ms | 955.46ms | 3.9% | - |
| 12 | pglite-fs-drizzle | orm | 924.57ms | 821.33ms | 951.76ms | 4.1% | -1% |

---

## 3. Round Trip (INSERT + SELECT)

30 iterations, 100 cycles of INSERT RETURNING + SELECT per iteration

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 0.30ms | 0.30ms | 0.31ms | 8.6% | - |
| 2 | sqlite-memory-drizzle | orm | 15.60ms | 13.73ms | 17.14ms | 8.1% | +5094% |
| 3 | sqlite-fs | raw | 729.97ms | 629.11ms | 889.01ms | 14.5% | - |
| 4 | sqlite-fs-drizzle | orm | 760.95ms | 701.84ms | 1085.71ms | 16.6% | +4% |
| 5 | pg | raw | 164.69ms | 155.74ms | 234.39ms | 25.2% | - |
| 6 | pg-drizzle | orm | 179.75ms | 171.57ms | 239.14ms | 23.0% | +9% |
| 7 | postgres | raw | 158.11ms | 151.50ms | 191.44ms | 8.8% | - |
| 8 | postgres-drizzle | orm | 192.89ms | 182.54ms | 205.10ms | 22.9% | +22% |
| 9 | pglite-memory | raw | 71.19ms | 62.60ms | 75.86ms | 6.9% | - |
| 10 | pglite-memory-drizzle | orm | 96.69ms | 84.88ms | 104.89ms | 6.3% | +36% |
| 11 | pglite-fs | raw | 78.30ms | 68.99ms | 80.42ms | 5.0% | - |
| 12 | pglite-fs-drizzle | orm | 90.47ms | 78.14ms | 95.09ms | 5.4% | +16% |

---

