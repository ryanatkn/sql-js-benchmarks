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
| 1 | sqlite | raw | 5.75ms | 5.50ms | 6.35ms | 4.4% | - |
| 2 | sqlite-drizzle | orm | 263.60ms | 257.50ms | 268.45ms | 1.5% | +4488% |
| 3 | pg | raw | 16.16ms | 15.85ms | 17.03ms | 4.9% | - |
| 4 | pg-drizzle | orm | 283.59ms | 250.15ms | 293.72ms | 3.0% | +1655% |
| 5 | postgres | raw | 13.04ms | 12.63ms | 15.82ms | 7.0% | - |
| 6 | postgres-drizzle | orm | 284.30ms | 273.39ms | 291.45ms | 2.2% | +2080% |
| 7 | pglite | raw | 12.11ms | 11.58ms | 12.35ms | 2.1% | - |
| 8 | pglite-drizzle | orm | 280.26ms | 271.99ms | 295.28ms | 2.7% | +2214% |

---

## 2. Cold Start Connection

30 iterations, fresh connection each time (connect + query)

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 1.74ms | 1.64ms | 1.96ms | 6.6% | - |
| 2 | sqlite-memory-drizzle | orm | 2.84ms | 2.75ms | 3.33ms | 19.7% | +63% |
| 3 | sqlite-fs | raw | 1.75ms | 1.67ms | 2.06ms | 6.1% | - |
| 4 | sqlite-fs-drizzle | orm | 2.73ms | 2.52ms | 2.95ms | 5.2% | +56% |
| 5 | pg | raw | 8.80ms | 8.50ms | 9.18ms | 2.4% | - |
| 6 | pg-drizzle | orm | 12.13ms | 10.75ms | 12.69ms | 4.2% | +38% |
| 7 | postgres | raw | 13.53ms | 12.98ms | 14.22ms | 3.9% | - |
| 8 | postgres-drizzle | orm | 14.42ms | 12.45ms | 16.93ms | 10.5% | +7% |
| 9 | pglite-memory | raw | 720.25ms | 657.81ms | 749.69ms | 3.6% | - |
| 10 | pglite-memory-drizzle | orm | 699.46ms | 647.36ms | 733.45ms | 4.4% | -3% |
| 11 | pglite-fs | raw | 953.28ms | 858.97ms | 1005.86ms | 5.1% | - |
| 12 | pglite-fs-drizzle | orm | 952.81ms | 854.49ms | 983.03ms | 3.8% | ~0% |

---

## 3. Round Trip (INSERT + SELECT)

30 iterations, 100 cycles of INSERT RETURNING + SELECT per iteration

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 0.30ms | 0.27ms | 0.40ms | 13.7% | - |
| 2 | sqlite-memory-drizzle | orm | 14.19ms | 13.78ms | 17.20ms | 13.4% | +4554% |
| 3 | sqlite-fs | raw | 745.49ms | 700.71ms | 943.80ms | 14.7% | - |
| 4 | sqlite-fs-drizzle | orm | 764.64ms | 732.58ms | 1176.00ms | 18.1% | +3% |
| 5 | pg | raw | 169.03ms | 151.58ms | 263.55ms | 27.2% | - |
| 6 | pg-drizzle | orm | 184.07ms | 171.46ms | 212.63ms | 23.2% | +9% |
| 7 | postgres | raw | 164.30ms | 154.09ms | 229.75ms | 16.5% | - |
| 8 | postgres-drizzle | orm | 206.35ms | 185.53ms | 472.76ms | 88.1% | +26% |
| 9 | pglite-memory | raw | 75.26ms | 63.74ms | 83.11ms | 8.1% | - |
| 10 | pglite-memory-drizzle | orm | 96.89ms | 84.95ms | 105.56ms | 7.5% | +29% |
| 11 | pglite-fs | raw | 79.41ms | 68.72ms | 89.83ms | 9.3% | - |
| 12 | pglite-fs-drizzle | orm | 90.58ms | 79.55ms | 100.01ms | 7.5% | +14% |

---

