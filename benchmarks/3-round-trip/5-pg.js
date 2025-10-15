import pg from 'pg';
import { BENCHMARK_3_ROUND_TRIP_ITERATIONS } from '../../lib/constants.js';

const client = new pg.Client({
	host: process.env.PGHOST || 'localhost',
	port: process.env.PGPORT || 5432,
	database: process.env.PGDATABASE || 'postgres',
	user: process.env.PGUSER || 'postgres',
	password: process.env.PGPASSWORD || ''
});

await client.connect();

await client.query('CREATE TABLE test (id SERIAL PRIMARY KEY, value TEXT)');

const start = process.hrtime.bigint();

for (let i = 0; i < BENCHMARK_3_ROUND_TRIP_ITERATIONS; i++) {
	const { rows } = await client.query(
		'INSERT INTO test (value) VALUES ($1) RETURNING id',
		['hello']
	);
	const result = await client.query('SELECT * FROM test WHERE id = $1', [rows[0].id]);
	if (result.rows[0].value !== 'hello') {
		throw new Error(`Expected 'hello', got '${result.rows[0].value}'`);
	}
}

const end = process.hrtime.bigint();

await client.query('DROP TABLE test');
await client.end();

console.log(
	JSON.stringify({
		phase: 'round-trip',
		driver: 'pg',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
