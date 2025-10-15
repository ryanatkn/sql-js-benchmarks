import Database from 'better-sqlite3';

const start = process.hrtime.bigint();
const db = new Database(':memory:');
const result = db.prepare('SELECT 1').get();
db.close();
const end = process.hrtime.bigint();

console.log(
	JSON.stringify({
		phase: 'minimal-query',
		driver: 'sqlite-memory',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
