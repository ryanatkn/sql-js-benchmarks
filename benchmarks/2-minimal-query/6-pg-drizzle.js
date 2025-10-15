import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { sql } from 'drizzle-orm';

const client = new pg.Client({
	host: process.env.PGHOST || 'localhost',
	port: process.env.PGPORT || 5432,
	database: process.env.PGDATABASE || 'postgres',
	user: process.env.PGUSER || 'postgres',
	password: process.env.PGPASSWORD || ''
});

const start = process.hrtime.bigint();
await client.connect();
const db = drizzle(client);
await db.execute(sql`SELECT 1`);
await client.end();
const end = process.hrtime.bigint();

console.log(
	JSON.stringify({
		phase: 'minimal-query',
		driver: 'pg-drizzle',
		variant: 'orm',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
