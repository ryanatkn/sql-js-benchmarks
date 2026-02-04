# PostgreSQL & SQLite Driver Benchmarks

- Node v24.9.0
- PostgreSQL 18.1
- @electric-sql/pglite 0.3.11
- better-sqlite3 12.4.1
- drizzle-orm 0.44.6
- pg 8.16.3
- postgres 3.4.7

---

## 1. Import Overhead

30 iterations, fresh Node process each time

| # | Driver           | Type | Median   | Min      | P90      | CV    | ORM Overhead |
| - | ---------------- | ---- | -------- | -------- | -------- | ----- | ------------ |
| 1 | sqlite           | raw  | 5.68ms   | 5.47ms   | 5.83ms   | 2.4%  | -            |
| 2 | sqlite-drizzle   | orm  | 264.17ms | 255.94ms | 275.72ms | 2.4%  | +4552%       |
| 3 | pg               | raw  | 16.11ms  | 15.72ms  | 17.05ms  | 5.7%  | -            |
| 4 | pg-drizzle       | orm  | 285.37ms | 249.99ms | 293.08ms | 3.1%  | +1671%       |
| 5 | postgres         | raw  | 12.83ms  | 12.58ms  | 16.64ms  | 10.0% | -            |
| 6 | postgres-drizzle | orm  | 277.87ms | 271.59ms | 287.89ms | 1.8%  | +2066%       |
| 7 | pglite           | raw  | 11.88ms  | 11.53ms  | 12.36ms  | 2.3%  | -            |
| 8 | pglite-drizzle   | orm  | 278.14ms | 270.70ms | 286.48ms | 1.9%  | +2241%       |

---

## 2. Cold Start Connection (New Database)

30 iterations, creates new database each time

| #  | Driver                | Type | Median   | Min      | P90      | CV   | ORM Overhead |
| -- | --------------------- | ---- | -------- | -------- | -------- | ---- | ------------ |
| 1  | sqlite-memory         | raw  | 1.59ms   | 1.55ms   | 1.76ms   | 5.1% | -            |
| 2  | sqlite-memory-drizzle | orm  | 2.79ms   | 2.63ms   | 2.96ms   | 3.4% | +76%         |
| 3  | sqlite-fs             | raw  | 1.77ms   | 1.66ms   | 1.94ms   | 5.3% | -            |
| 4  | sqlite-fs-drizzle     | orm  | 2.67ms   | 2.48ms   | 2.83ms   | 3.6% | +51%         |
| 5  | pg                    | raw  | 8.87ms   | 8.50ms   | 9.18ms   | 2.7% | -            |
| 6  | pg-drizzle            | orm  | 12.11ms  | 11.10ms  | 12.88ms  | 3.7% | +36%         |
| 7  | postgres              | raw  | 13.68ms  | 12.38ms  | 14.40ms  | 6.7% | -            |
| 8  | postgres-drizzle      | orm  | 14.46ms  | 13.54ms  | 17.11ms  | 8.3% | +6%          |
| 9  | pglite-memory         | raw  | 741.57ms | 683.37ms | 774.14ms | 3.6% | -            |
| 10 | pglite-memory-drizzle | orm  | 710.94ms | 649.48ms | 742.16ms | 3.7% | -4%          |
| 11 | pglite-fs             | raw  | 942.39ms | 835.61ms | 975.36ms | 4.7% | -            |
| 12 | pglite-fs-drizzle     | orm  | 946.22ms | 837.11ms | 990.94ms | 4.0% | ~0%          |

---

## 2b. Cold Start Connection (Reopen Existing)

30 iterations, reopens existing database each time

| # | Driver            | Type | Median   | Min      | P90      | CV    | ORM Overhead |
| - | ----------------- | ---- | -------- | -------- | -------- | ----- | ------------ |
| 1 | sqlite-fs         | raw  | 1.72ms   | 1.59ms   | 1.84ms   | 32.5% | -            |
| 2 | sqlite-fs-drizzle | orm  | 2.84ms   | 2.64ms   | 2.99ms   | 4.5%  | +65%         |
| 3 | pglite-fs         | raw  | 175.03ms | 168.06ms | 182.97ms | 2.9%  | -            |
| 4 | pglite-fs-drizzle | orm  | 171.89ms | 167.75ms | 178.60ms | 2.4%  | -2%          |

---

## 3. Round Trip (INSERT + SELECT)

30 iterations, 100 cycles of INSERT RETURNING + SELECT per iteration

| #  | Driver                | Type | Median   | Min      | P90       | CV     | ORM Overhead |
| -- | --------------------- | ---- | -------- | -------- | --------- | ------ | ------------ |
| 1  | sqlite-memory         | raw  | 0.30ms   | 0.30ms   | 0.31ms    | 10.3%  | -            |
| 2  | sqlite-memory-drizzle | orm  | 15.77ms  | 13.64ms  | 18.34ms   | 6.6%   | +5103%       |
| 3  | sqlite-fs             | raw  | 735.86ms | 689.56ms | 1366.39ms | 126.4% | -            |
| 4  | sqlite-fs-drizzle     | orm  | 765.59ms | 729.14ms | 1198.00ms | 19.8%  | +4%          |
| 5  | pg                    | raw  | 198.54ms | 157.37ms | 265.28ms  | 23.7%  | -            |
| 6  | pg-drizzle            | orm  | 220.72ms | 178.05ms | 303.73ms  | 20.6%  | +11%         |
| 7  | postgres              | raw  | 209.45ms | 191.90ms | 402.91ms  | 27.8%  | -            |
| 8  | postgres-drizzle      | orm  | 251.34ms | 191.07ms | 357.27ms  | 20.6%  | +20%         |
| 9  | pglite-memory         | raw  | 72.88ms  | 64.09ms  | 76.63ms   | 5.5%   | -            |
| 10 | pglite-memory-drizzle | orm  | 96.76ms  | 84.34ms  | 104.56ms  | 6.4%   | +33%         |
| 11 | pglite-fs             | raw  | 79.41ms  | 68.65ms  | 84.81ms   | 5.7%   | -            |
| 12 | pglite-fs-drizzle     | orm  | 90.72ms  | 78.92ms  | 94.51ms   | 6.4%   | +14%         |

---
