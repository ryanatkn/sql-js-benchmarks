# PostgreSQL & SQLite Driver Benchmarks

- Node: v24.9.0
- PostgreSQL: 17.5

---

## 1. Import Overhead (Cold Start)

30 iterations, fresh Node process each time

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite | raw | 5.56ms | 5.48ms | 5.86ms | 2.4% | - |
| 2 | sqlite-drizzle | orm | 258.89ms | 255.57ms | 261.85ms | 0.7% | +4555% |
| 3 | pg | raw | 15.97ms | 15.79ms | 16.68ms | 4.7% | - |
| 4 | pg-drizzle | orm | 280.84ms | 277.85ms | 284.57ms | 0.8% | +1659% |
| 5 | postgres | raw | 12.86ms | 12.72ms | 13.37ms | 6.8% | - |
| 6 | postgres-drizzle | orm | 274.28ms | 271.77ms | 279.55ms | 0.9% | +2033% |
| 7 | pglite | raw | 11.95ms | 11.69ms | 12.21ms | 1.6% | - |
| 8 | pglite-drizzle | orm | 274.45ms | 270.18ms | 278.46ms | 0.9% | +2196% |

**Key Findings:**
- Drizzle adds ~265ms import overhead to pg driver
- postgres is 19% faster than pg for imports
---

## 2. Minimal Query (SELECT 1)

30 iterations, full operation (cold start: connect + query + close)

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 1.60ms | 1.56ms | 1.68ms | 4.0% | - |
| 2 | sqlite-memory-drizzle | orm | 2.80ms | 2.75ms | 2.86ms | 2.1% | +75% |
| 3 | sqlite-fs | raw | 1.67ms | 1.64ms | 1.72ms | 1.5% | - |
| 4 | sqlite-fs-drizzle | orm | 2.66ms | 2.60ms | 2.74ms | 1.2% | +59% |
| 5 | pg | raw | 10.54ms | 10.11ms | 10.71ms | 1.7% | - |
| 6 | pg-drizzle | orm | 14.15ms | 12.66ms | 15.04ms | 5.8% | +34% |
| 7 | postgres | raw | 15.80ms | 14.27ms | 16.73ms | 3.5% | - |
| 8 | postgres-drizzle | orm | 17.00ms | 14.93ms | 19.10ms | 7.5% | +8% |
| 9 | pglite-memory | raw | 710.68ms | 649.71ms | 741.72ms | 3.6% | - |
| 10 | pglite-memory-drizzle | orm | 702.95ms | 639.71ms | 718.39ms | 3.9% | -1% |
| 11 | pglite-fs | raw | 914.61ms | 828.64ms | 930.01ms | 3.1% | - |
| 12 | pglite-fs-drizzle | orm | 920.05ms | 835.38ms | 938.61ms | 4.1% | +1% |

**Key Findings:**
- Drizzle adds ~21% overhead for full operation
---

## 3. Round Trip (INSERT + SELECT)

30 iterations, 100 cycles of INSERT RETURNING + SELECT per iteration

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 0.30ms | 0.29ms | 0.30ms | 1.2% | - |
| 2 | sqlite-memory-drizzle | orm | 15.92ms | 13.95ms | 17.53ms | 6.6% | +5272% |
| 3 | sqlite-fs | raw | 715.87ms | 638.83ms | 1020.73ms | 15.5% | - |
| 4 | sqlite-fs-drizzle | orm | 718.23ms | 672.96ms | 1149.22ms | 21.6% | ~0% |
| 5 | pg | raw | 159.74ms | 153.16ms | 180.83ms | 27.3% | - |
| 6 | pg-drizzle | orm | 175.96ms | 165.61ms | 243.21ms | 24.5% | +10% |
| 7 | postgres | raw | 157.67ms | 151.45ms | 233.05ms | 24.7% | - |
| 8 | postgres-drizzle | orm | 190.72ms | 183.38ms | 242.53ms | 19.2% | +21% |
| 9 | pglite-memory | raw | 71.45ms | 62.62ms | 72.87ms | 5.9% | - |
| 10 | pglite-memory-drizzle | orm | 95.86ms | 81.06ms | 98.24ms | 7.1% | +34% |
| 11 | pglite-fs | raw | 79.22ms | 69.72ms | 84.46ms | 4.6% | - |
| 12 | pglite-fs-drizzle | orm | 89.83ms | 78.99ms | 93.49ms | 5.8% | +13% |

---

