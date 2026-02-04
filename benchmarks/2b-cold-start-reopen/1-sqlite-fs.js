import Database from 'better-sqlite3';

const dbPath = './tmp/sqlite-existing.db';

const start = process.hrtime.bigint();
const db = new Database(dbPath);
db.prepare('SELECT 1').get();
const end = process.hrtime.bigint();

db.close();

console.log(
	JSON.stringify({
		phase: 'cold-start-reopen',
		driver: 'sqlite-fs',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000,
	}),
);
