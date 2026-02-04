import { rmSync } from 'fs';

rmSync('./tmp/sqlite-existing.db', { force: true });
rmSync('./tmp/pglite-existing', { recursive: true, force: true });
