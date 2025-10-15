import { drizzle } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';
import { sql } from 'drizzle-orm';

const start = process.hrtime.bigint();
const sqlite = new Database(':memory:');
const db = drizzle(sqlite);
db.get(sql`SELECT 1`);
sqlite.close();
const end = process.hrtime.bigint();

console.log(
	JSON.stringify({
		phase: 'minimal-query',
		driver: 'sqlite-memory-drizzle',
		variant: 'orm',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
