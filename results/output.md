# PostgreSQL & SQLite Driver Benchmarks

**Generated:** 2025-10-15T11:15:08.944Z
**Node:** v24.9.0 | **PostgreSQL:** 17.5

---

## 1. Import Overhead (Cold Start)

30 iterations, fresh Node process each time

| # | Driver | Type | Median | Min | Max | P95 | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite | raw | 5.58ms | 5.48ms | 6.33ms | 6.27ms | - |
| 2 | sqlite-drizzle | orm | 259.56ms | 254.82ms | 278.36ms | 269.73ms | +4554% |
| 3 | pg | raw | 16.87ms | 15.97ms | 21.88ms | 21.60ms | - |
| 4 | pg-drizzle | orm | 289.82ms | 281.37ms | 302.88ms | 302.73ms | +1618% |
| 5 | postgres | raw | 13.62ms | 12.83ms | 17.39ms | 17.02ms | - |
| 6 | postgres-drizzle | orm | 276.95ms | 244.61ms | 305.78ms | 296.54ms | +1933% |
| 7 | pglite | raw | 12.15ms | 11.76ms | 12.91ms | 12.90ms | - |
| 8 | pglite-drizzle | orm | 277.72ms | 272.24ms | 307.89ms | 304.45ms | +2186% |

**Key Findings:**
- Drizzle adds ~273ms import overhead to pg driver
- postgres is 19% faster than pg for imports
---

## 2. Minimal Query (SELECT 1)

30 iterations, full operation (cold start: connect + query + close)

| # | Driver | Type | Median | Min | Max | P95 | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 1.65ms | 1.58ms | 1.84ms | 1.77ms | - |
| 2 | sqlite-memory-drizzle | orm | 2.81ms | 2.75ms | 2.94ms | 2.88ms | +70% |
| 3 | sqlite-fs | raw | 1.78ms | 1.66ms | 2.07ms | 1.91ms | - |
| 4 | sqlite-fs-drizzle | orm | 2.67ms | 2.36ms | 2.78ms | 2.73ms | +50% |
| 5 | pg | raw | 10.84ms | 10.33ms | 11.49ms | 11.43ms | - |
| 6 | pg-drizzle | orm | 14.28ms | 13.55ms | 15.46ms | 15.04ms | +32% |
| 7 | postgres | raw | 15.97ms | 15.30ms | 18.74ms | 17.00ms | - |
| 8 | postgres-drizzle | orm | 17.71ms | 15.34ms | 19.89ms | 19.55ms | +11% |
| 9 | pglite-memory | raw | 714.44ms | 652.79ms | 729.77ms | 729.70ms | - |
| 10 | pglite-memory-drizzle | orm | 716.59ms | 644.76ms | 761.92ms | 759.37ms | ~0% |
| 11 | pglite-fs | raw | 908.85ms | 822.59ms | 982.85ms | 981.13ms | - |
| 12 | pglite-fs-drizzle | orm | 920.49ms | 822.88ms | 971.08ms | 969.59ms | +1% |

**Key Findings:**
- Drizzle adds ~21% overhead for full operation
---

## 3. Round Trip (INSERT + SELECT)

30 iterations, 100 cycles of INSERT RETURNING + SELECT per iteration

| # | Driver | Type | Median | Min | Max | P95 | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 0.30ms | 0.30ms | 0.33ms | 0.31ms | - |
| 2 | sqlite-memory-drizzle | orm | 15.86ms | 13.89ms | 19.09ms | 18.98ms | +5173% |
| 3 | sqlite-fs | raw | 722.36ms | 649.31ms | 1074.50ms | 1029.04ms | - |
| 4 | sqlite-fs-drizzle | orm | 749.73ms | 700.66ms | 1318.10ms | 1158.24ms | +4% |
| 5 | pg | raw | 162.45ms | 155.98ms | 415.50ms | 336.33ms | - |
| 6 | pg-drizzle | orm | 177.67ms | 171.00ms | 437.13ms | 294.78ms | +9% |
| 7 | postgres | raw | 159.82ms | 148.06ms | 398.16ms | 270.27ms | - |
| 8 | postgres-drizzle | orm | 188.86ms | 182.58ms | 422.52ms | 338.93ms | +18% |
| 9 | pglite | raw | 71.54ms | 62.89ms | 74.63ms | 73.65ms | - |
| 10 | pglite-drizzle | orm | 95.68ms | 84.28ms | 109.44ms | 105.92ms | +34% |
| 11 | pglite-fs | raw | 73.53ms | 68.94ms | 81.36ms | 79.67ms | - |
| 12 | pglite-fs-drizzle | orm | 87.71ms | 79.47ms | 97.90ms | 95.74ms | +19% |

---

