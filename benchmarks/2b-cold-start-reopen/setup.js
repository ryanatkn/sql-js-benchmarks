import Database from 'better-sqlite3';
import { PGlite } from '@electric-sql/pglite';
import { mkdirSync } from 'fs';

mkdirSync('./tmp', { recursive: true });

// Create sqlite database
const sqliteDb = new Database('./tmp/sqlite-existing.db');
sqliteDb.close();
console.log('  Created sqlite-existing.db');

// Create pglite database
const pgliteDb = new PGlite('./tmp/pglite-existing');
await pgliteDb.close();
console.log('  Created pglite-existing/');
