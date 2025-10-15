import { execSync } from 'child_process';
import { readFileSync } from 'fs';
import { PSQL_VERSION_COMMAND, PSQL_VERSION_REGEX } from './constants.js';

/**
 * Capture environment information for reproducibility
 */
export function getEnvironmentInfo() {
	const env = {
		timestamp: new Date().toISOString(),
		node: process.version,
	};

	// Try to get PostgreSQL version if available
	try {
		const pgVersion = execSync(PSQL_VERSION_COMMAND, { encoding: 'utf8' }).trim();
		env.postgresql = pgVersion.match(PSQL_VERSION_REGEX)?.[0] || pgVersion;
	} catch {
		env.postgresql = 'not installed or not in PATH';
	}

	// Read package.json to get dependency versions
	try {
		const packageJson = JSON.parse(readFileSync('./package.json', 'utf8'));
		env.dependencies = packageJson.dependencies;
	} catch {
		env.dependencies = {};
	}

	return env;
}

/**
 * Format environment info as markdown
 */
export function formatEnvironmentMarkdown(env) {
	let markdown = `- Node ${env.node}\n- PostgreSQL ${env.postgresql}`;

	// Add dependency versions
	if (env.dependencies) {
		for (const [dep, version] of Object.entries(env.dependencies)) {
			markdown += `\n- ${dep} ${version}`;
		}
	}

	return markdown;
}
