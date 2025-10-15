import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { sql } from 'drizzle-orm';

const client = postgres({
	host: process.env.PGHOST || 'localhost',
	port: process.env.PGPORT || 5432,
	database: process.env.PGDATABASE || 'postgres',
	user: process.env.PGUSER || 'postgres',
	password: process.env.PGPASSWORD || ''
});

const start = process.hrtime.bigint();
const db = drizzle(client);
await db.execute(sql`SELECT 1`);
const end = process.hrtime.bigint();

await client.end();

console.log(
	JSON.stringify({
		phase: 'cold-start-connection',
		driver: 'postgres-drizzle',
		variant: 'orm',
		time_ns: Number(end - start),
		time_ms: Number(end - start) / 1_000_000
	})
);
