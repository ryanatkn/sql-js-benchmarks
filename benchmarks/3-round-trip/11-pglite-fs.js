import { PGlite } from '@electric-sql/pglite';
import { rmSync } from 'fs';
import { BENCHMARK_3_ROUND_TRIP_ITERATIONS } from '../../lib/constants.js';

const dataDir = `./tmp/pglite-bench-${Date.now()}`;

const db = new PGlite(dataDir);

await db.query('CREATE TABLE test (id SERIAL PRIMARY KEY, value TEXT)');

const start = process.hrtime.bigint();

for (let i = 0; i < BENCHMARK_3_ROUND_TRIP_ITERATIONS; i++) {
	const { rows } = await db.query(
		'INSERT INTO test (value) VALUES ($1) RETURNING id',
		['hello']
	);
	await db.query('SELECT * FROM test WHERE id = $1', [rows[0].id]);
}

const end = process.hrtime.bigint();

await db.query('DROP TABLE test');
await db.close();

rmSync(dataDir, { recursive: true, force: true });

console.log(
	JSON.stringify({
		phase: 'round-trip',
		driver: 'pglite-fs',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
