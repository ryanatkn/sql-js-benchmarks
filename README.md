# PostgreSQL and sqlite benchmarks for Node

Benchmark suite to measure SQL database driver performance and ORM overhead in Node.

See [results/output.md](results/output.md).

## What this measures

- benchmark 1 - import overhead
- benchmark 2 - cold start connection (connect + SELECT 1 query)
- benchmark 3 - round trip (INSERT + SELECT) - 100 times per iteration
- Drizzle overhead for each of the benchmarks

## Benchmarked drivers

**PostgreSQL (network):**
- `pg`
- `postgres`

**PGlite (WASM, in-memory and filesystem):**
- `pglite-memory`
- `pglite-fs`

**SQLite (in-memory and filesystem):**
- `sqlite-memory` (`better-sqlite3`)
- `sqlite-fs` (`better-sqlite3`)

**ORMs:**
- Drizzle ORM variants for all drivers above

## Prerequisites

- Node 18+
- PostgreSQL server running locally

## Usage

```bash
npm install
npm start
```

Generates output:

- [results/output.md](./results/output.md)
- [results/output.json](./results/output.json)

Environment variables:

```bash
PGHOST="localhost"
PGPORT=5432
PGDATABASE="postgres"
PGUSER="postgres"
PGPASSWORD=""
```

## Results

[results/output.md](results/output.md)

## Project structure

```
pg_js_benchmarks/
├── benchmarks/
│   ├── 1-import/                  (8 variants - no in-memory variants)
│   ├── 2-cold-start-connection/   (12 variants)
│   └── 3-round-trip/              (12 variants)
├── lib/
│   ├── bench.js
│   ├── format.js
│   ├── constants.js
│   └── env.js
├── run.js
└── results/
```
