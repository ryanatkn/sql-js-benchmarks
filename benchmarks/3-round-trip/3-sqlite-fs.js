import Database from 'better-sqlite3';
import { unlinkSync } from 'fs';
import { BENCHMARK_3_ROUND_TRIP_ITERATIONS } from '../../lib/constants.js';

const dbPath = `./tmp/sqlite-bench-${Date.now()}.db`;

const db = new Database(dbPath);

db.exec('CREATE TABLE test (id INTEGER PRIMARY KEY AUTOINCREMENT, value TEXT)');

const insertStmt = db.prepare('INSERT INTO test (value) VALUES (?)');
const selectStmt = db.prepare('SELECT * FROM test WHERE id = ?');

const start = process.hrtime.bigint();

for (let i = 0; i < BENCHMARK_3_ROUND_TRIP_ITERATIONS; i++) {
	const info = insertStmt.run('hello');
	selectStmt.get(info.lastInsertRowid);
}

const end = process.hrtime.bigint();

db.exec('DROP TABLE test');
db.close();

unlinkSync(dbPath);

console.log(
	JSON.stringify({
		phase: 'round-trip',
		driver: 'sqlite-fs',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
