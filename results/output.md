# PostgreSQL & SQLite Driver Benchmarks

- Node v24.9.0
- PostgreSQL 17.5
- @electric-sql/pglite 0.3.11
- better-sqlite3 12.4.1
- drizzle-orm 0.44.6
- pg 8.16.3
- postgres 3.4.7

---

## 1. Import Overhead

30 iterations, fresh Node process each time

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite | raw | 5.81ms | 5.53ms | 6.30ms | 4.5% | - |
| 2 | sqlite-drizzle | orm | 266.20ms | 255.77ms | 273.26ms | 2.1% | +4478% |
| 3 | pg | raw | 16.15ms | 15.87ms | 19.45ms | 9.6% | - |
| 4 | pg-drizzle | orm | 274.44ms | 246.24ms | 304.55ms | 7.5% | +1599% |
| 5 | postgres | raw | 13.11ms | 12.69ms | 16.72ms | 12.0% | - |
| 6 | postgres-drizzle | orm | 282.66ms | 246.96ms | 297.18ms | 5.3% | +2056% |
| 7 | pglite | raw | 12.36ms | 11.08ms | 13.99ms | 15.3% | - |
| 8 | pglite-drizzle | orm | 280.85ms | 273.05ms | 289.56ms | 2.2% | +2171% |

---

## 2. Cold Start Connection

30 iterations, fresh connection each time (connect + query)

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 1.65ms | 1.61ms | 1.87ms | 88.6% | - |
| 2 | sqlite-memory-drizzle | orm | 2.91ms | 2.57ms | 3.15ms | 5.3% | +76% |
| 3 | sqlite-fs | raw | 1.79ms | 1.70ms | 1.93ms | 6.2% | - |
| 4 | sqlite-fs-drizzle | orm | 2.69ms | 2.60ms | 2.91ms | 4.8% | +51% |
| 5 | pg | raw | 8.84ms | 8.43ms | 9.41ms | 13.6% | - |
| 6 | pg-drizzle | orm | 12.07ms | 10.76ms | 12.74ms | 4.1% | +37% |
| 7 | postgres | raw | 13.10ms | 12.73ms | 13.95ms | 16.9% | - |
| 8 | postgres-drizzle | orm | 14.37ms | 13.59ms | 16.81ms | 7.7% | +10% |
| 9 | pglite-memory | raw | 732.92ms | 654.43ms | 788.87ms | 6.3% | - |
| 10 | pglite-memory-drizzle | orm | 710.15ms | 651.46ms | 747.33ms | 4.5% | -3% |
| 11 | pglite-fs | raw | 957.92ms | 835.43ms | 1000.50ms | 4.9% | - |
| 12 | pglite-fs-drizzle | orm | 973.22ms | 870.26ms | 1024.33ms | 6.5% | +2% |

---

## 3. Round Trip (INSERT + SELECT)

30 iterations, 100 cycles of INSERT RETURNING + SELECT per iteration

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 0.31ms | 0.30ms | 0.41ms | 14.8% | - |
| 2 | sqlite-memory-drizzle | orm | 16.04ms | 13.65ms | 17.66ms | 6.5% | +5070% |
| 3 | sqlite-fs | raw | 722.51ms | 655.88ms | 1143.02ms | 18.9% | - |
| 4 | sqlite-fs-drizzle | orm | 770.08ms | 669.85ms | 1091.97ms | 14.9% | +7% |
| 5 | pg | raw | 174.43ms | 166.87ms | 244.17ms | 29.0% | - |
| 6 | pg-drizzle | orm | 181.32ms | 174.82ms | 196.79ms | 4.0% | +4% |
| 7 | postgres | raw | 158.34ms | 149.69ms | 217.30ms | 17.5% | - |
| 8 | postgres-drizzle | orm | 191.89ms | 186.49ms | 208.41ms | 3.6% | +21% |
| 9 | pglite-memory | raw | 75.22ms | 64.22ms | 80.87ms | 7.0% | - |
| 10 | pglite-memory-drizzle | orm | 98.45ms | 84.49ms | 117.36ms | 9.5% | +31% |
| 11 | pglite-fs | raw | 79.76ms | 68.93ms | 87.12ms | 7.9% | - |
| 12 | pglite-fs-drizzle | orm | 91.31ms | 79.49ms | 98.71ms | 7.0% | +14% |

---

