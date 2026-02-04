import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sql } from 'drizzle-orm';

const dbPath = './tmp/sqlite-existing.db';

const start = process.hrtime.bigint();
const sqlite = new Database(dbPath);
const db = drizzle(sqlite);
db.get(sql`SELECT 1`);
const end = process.hrtime.bigint();

sqlite.close();

console.log(
	JSON.stringify({
		phase: 'cold-start-reopen',
		driver: 'sqlite-fs-drizzle',
		variant: 'orm',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000,
	}),
);
