# PostgreSQL & SQLite Driver Benchmarks

- Node: v24.9.0
- PostgreSQL: 17.5

---

## 1. Import Overhead

30 iterations, fresh Node process each time

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite | raw | 5.56ms | 5.50ms | 5.83ms | 2.3% | - |
| 2 | sqlite-drizzle | orm | 255.24ms | 224.14ms | 258.88ms | 2.5% | +4491% |
| 3 | pg | raw | 15.99ms | 15.85ms | 19.16ms | 7.1% | - |
| 4 | pg-drizzle | orm | 279.82ms | 270.30ms | 285.12ms | 1.2% | +1650% |
| 5 | postgres | raw | 12.82ms | 12.61ms | 13.46ms | 2.6% | - |
| 6 | postgres-drizzle | orm | 274.56ms | 271.24ms | 277.63ms | 0.9% | +2042% |
| 7 | pglite | raw | 11.92ms | 11.72ms | 12.60ms | 2.1% | - |
| 8 | pglite-drizzle | orm | 271.01ms | 238.97ms | 275.67ms | 3.3% | +2174% |

**Key Findings:**
- Drizzle adds ~264ms import overhead to pg driver
- postgres is 20% faster than pg for imports
---

## 2. Cold Start Connection

30 iterations, fresh connection each time (connect + query)

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 1.59ms | 1.55ms | 1.63ms | 2.1% | - |
| 2 | sqlite-memory-drizzle | orm | 2.78ms | 2.45ms | 2.82ms | 20.9% | +75% |
| 3 | sqlite-fs | raw | 1.67ms | 1.62ms | 1.76ms | 3.2% | - |
| 4 | sqlite-fs-drizzle | orm | 2.65ms | 2.61ms | 2.69ms | 0.8% | +59% |
| 5 | pg | raw | 8.61ms | 8.34ms | 8.81ms | 14.6% | - |
| 6 | pg-drizzle | orm | 11.85ms | 10.68ms | 12.29ms | 5.0% | +38% |
| 7 | postgres | raw | 13.12ms | 12.04ms | 13.96ms | 18.3% | - |
| 8 | postgres-drizzle | orm | 14.07ms | 12.70ms | 16.51ms | 8.8% | +7% |
| 9 | pglite-memory | raw | 708.93ms | 641.41ms | 721.76ms | 3.0% | - |
| 10 | pglite-memory-drizzle | orm | 697.01ms | 632.77ms | 709.83ms | 4.4% | -2% |
| 11 | pglite-fs | raw | 920.06ms | 835.54ms | 944.59ms | 3.4% | - |
| 12 | pglite-fs-drizzle | orm | 919.61ms | 824.50ms | 938.59ms | 3.7% | ~0% |

**Key Findings:**
- Drizzle adds ~22% overhead for full operation
---

## 3. Round Trip (INSERT + SELECT)

30 iterations, 100 cycles of INSERT RETURNING + SELECT per iteration

| # | Driver | Type | Median | Min | P90 | CV | ORM Overhead |
|---|---|---|---|---|---|---|---|
| 1 | sqlite-memory | raw | 0.29ms | 0.29ms | 0.31ms | 6.0% | - |
| 2 | sqlite-memory-drizzle | orm | 15.86ms | 14.11ms | 16.55ms | 3.4% | +5287% |
| 3 | sqlite-fs | raw | 735.48ms | 696.86ms | 1075.24ms | 18.1% | - |
| 4 | sqlite-fs-drizzle | orm | 741.20ms | 689.87ms | 1159.76ms | 18.4% | +1% |
| 5 | pg | raw | 162.68ms | 153.70ms | 206.40ms | 9.3% | - |
| 6 | pg-drizzle | orm | 175.58ms | 166.79ms | 238.78ms | 23.2% | +8% |
| 7 | postgres | raw | 158.27ms | 148.94ms | 194.25ms | 25.9% | - |
| 8 | postgres-drizzle | orm | 190.26ms | 181.60ms | 261.45ms | 21.4% | +20% |
| 9 | pglite-memory | raw | 71.37ms | 62.58ms | 72.94ms | 6.3% | - |
| 10 | pglite-memory-drizzle | orm | 95.90ms | 83.64ms | 100.40ms | 7.1% | +34% |
| 11 | pglite-fs | raw | 78.03ms | 67.62ms | 79.23ms | 6.2% | - |
| 12 | pglite-fs-drizzle | orm | 89.99ms | 79.09ms | 92.78ms | 5.0% | +15% |

---

