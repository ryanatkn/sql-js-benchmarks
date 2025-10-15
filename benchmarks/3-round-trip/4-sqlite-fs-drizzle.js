import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sql, eq } from 'drizzle-orm';
import { integer, text, sqliteTable } from 'drizzle-orm/sqlite-core';
import { unlinkSync } from 'fs';
import { BENCHMARK_3_ROUND_TRIP_ITERATIONS } from '../../lib/constants.js';

const testTable = sqliteTable('test', {
	id: integer('id').primaryKey({ autoIncrement: true }),
	value: text('value')
});

const dbPath = `./tmp/sqlite-bench-${Date.now()}.db`;

const sqlite = new Database(dbPath);
const db = drizzle(sqlite);

db.run(sql`CREATE TABLE test (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT)`);

const start = process.hrtime.bigint();

for (let i = 0; i < BENCHMARK_3_ROUND_TRIP_ITERATIONS; i++) {
	const [inserted] = db
		.insert(testTable)
		.values({ value: 'hello' })
		.returning({ id: testTable.id })
		.all();

	db
		.select()
		.from(testTable)
		.where(eq(testTable.id, inserted.id))
		.get();
}

const end = process.hrtime.bigint();

db.run(sql`DROP TABLE test`);
sqlite.close();

unlinkSync(dbPath);

console.log(
	JSON.stringify({
		phase: 'round-trip',
		driver: 'sqlite-fs-drizzle',
		variant: 'orm',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
