import postgres from 'postgres';
import { BENCHMARK_3_ROUND_TRIP_ITERATIONS } from '../../lib/constants.js';

const sql = postgres({
	host: process.env.PGHOST || 'localhost',
	port: process.env.PGPORT || 5432,
	database: process.env.PGDATABASE || 'postgres',
	user: process.env.PGUSER || 'postgres',
	password: process.env.PGPASSWORD || ''
});

await sql`CREATE TABLE test (id SERIAL PRIMARY KEY, value TEXT)`;

const start = process.hrtime.bigint();

for (let i = 0; i < BENCHMARK_3_ROUND_TRIP_ITERATIONS; i++) {
	const [{ id }] = await sql`INSERT INTO test (value) VALUES (${'hello'}) RETURNING id`;
	const [result] = await sql`SELECT * FROM test WHERE id = ${id}`;
	if (result.value !== 'hello') {
		throw new Error(`Expected 'hello', got '${result.value}'`);
	}
}

const end = process.hrtime.bigint();

await sql`DROP TABLE test`;
await sql.end();

console.log(
	JSON.stringify({
		phase: 'round-trip',
		driver: 'postgres',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
