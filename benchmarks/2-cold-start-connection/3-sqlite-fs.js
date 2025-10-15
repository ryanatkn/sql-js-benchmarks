import Database from 'better-sqlite3';
import { unlinkSync } from 'fs';

const dbPath = `./tmp/sqlite-bench-${Date.now()}.db`;

const start = process.hrtime.bigint();
const db = new Database(dbPath);
db.prepare('SELECT 1').get();
const end = process.hrtime.bigint();

db.close();

unlinkSync(dbPath);

console.log(
	JSON.stringify({
		phase: 'cold-start-connection',
		driver: 'sqlite-fs',
		variant: 'raw',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
