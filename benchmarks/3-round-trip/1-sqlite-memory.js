import Database from 'better-sqlite3';
import { BENCHMARK_3_ROUND_TRIP_ITERATIONS } from '../../lib/constants.js';

const db = new Database(':memory:');

db.exec('CREATE TABLE test (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT)');

const insertStmt = db.prepare('INSERT INTO test (value) VALUES (?)');
const selectStmt = db.prepare('SELECT * FROM test WHERE id = ?');

const start = process.hrtime.bigint();

for (let i = 0; i < BENCHMARK_3_ROUND_TRIP_ITERATIONS; i++) {
	const info = insertStmt.run('hello');
	const result = selectStmt.get(info.lastInsertRowid);
	if (result.value !== 'hello') {
		throw new Error(`Expected 'hello', got '${result.value}'`);
	}
}

const end = process.hrtime.bigint();

db.exec('DROP TABLE test');
db.close();

console.log(
	JSON.stringify({
		phase: 'round-trip',
		driver: 'sqlite-memory',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
