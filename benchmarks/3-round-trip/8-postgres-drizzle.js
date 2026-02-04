import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { eq, sql } from 'drizzle-orm';
import { pgTable, serial, text } from 'drizzle-orm/pg-core';
import { BENCHMARK_3_ROUND_TRIP_ITERATIONS } from '../../lib/constants.js';

const testTable = pgTable('test', {
	id: serial('id').primaryKey(),
	value: text('value'),
});

const client = postgres({
	host: process.env.PGHOST || 'localhost',
	port: process.env.PGPORT || 5432,
	database: process.env.PGDATABASE || 'postgres',
	user: process.env.PGUSER || 'postgres',
	password: process.env.PGPASSWORD || '',
});

const db = drizzle(client);

await db.execute(sql`CREATE TABLE test (id SERIAL PRIMARY KEY, value TEXT)`);

const start = process.hrtime.bigint();

for (let i = 0; i < BENCHMARK_3_ROUND_TRIP_ITERATIONS; i++) {
	const [inserted] = await db
		.insert(testTable)
		.values({ value: 'hello' })
		.returning({ id: testTable.id });

	const [result] = await db
		.select()
		.from(testTable)
		.where(eq(testTable.id, inserted.id));
	if (result.value !== 'hello') {
		throw new Error(`Expected 'hello', got '${result.value}'`);
	}
}

const end = process.hrtime.bigint();

await db.execute(sql`DROP TABLE test`);
await client.end();

console.log(
	JSON.stringify({
		phase: 'round-trip',
		driver: 'postgres-drizzle',
		variant: 'orm',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000,
	}),
);
