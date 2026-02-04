#!/usr/bin/env node

import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'fs';
import { join } from 'path';
import { execSync } from 'child_process';
import { runBenchmark } from './lib/bench.js';
import { formatResultsTable, formatResultsTableWithORM } from './lib/format.js';
import { formatEnvironmentMarkdown, getEnvironmentInfo } from './lib/env.js';
import {
	BENCHMARK_3_ROUND_TRIP_ITERATIONS,
	BENCHMARK_TITLE,
	BENCHMARKS_DIR,
	DECIMAL_PLACES,
	DEFAULT_ITERATIONS,
	MARKDOWN_SEPARATOR,
	OUTPUT_JSON_FILE,
	OUTPUT_MD_FILE,
	RESULTS_DIR,
	TEST_FILE_EXTENSION,
} from './lib/constants.js';

// Benchmark phases configuration
const PHASES = [
	{
		id: '1-import',
		name: 'import',
		title: '1. Import Overhead',
		description: `${DEFAULT_ITERATIONS} iterations, fresh Node process each time`,
		withOrm: true,
	},
	{
		id: '2-cold-start-connection',
		name: 'cold-start-connection',
		title: '2. Cold Start Connection (New Database)',
		description: `${DEFAULT_ITERATIONS} iterations, creates new database each time`,
		withOrm: true,
	},
	{
		id: '2b-cold-start-reopen',
		name: 'cold-start-reopen',
		title: '2b. Cold Start Connection (Reopen Existing)',
		description: `${DEFAULT_ITERATIONS} iterations, reopens existing database each time`,
		withOrm: true,
	},
	{
		id: '3-round-trip',
		name: 'round-trip',
		title: '3. Round Trip (INSERT + SELECT)',
		description:
			`${DEFAULT_ITERATIONS} iterations, ${BENCHMARK_3_ROUND_TRIP_ITERATIONS} cycles of INSERT RETURNING + SELECT per iteration`,
		withOrm: true,
	},
];

/**
 * Clean and recreate results directory
 */
function cleanResultsDirectory() {
	console.log('🧹 Cleaning results directory...');
	rmSync(RESULTS_DIR, { recursive: true, force: true });
	mkdirSync(RESULTS_DIR, { recursive: true });
}

/**
 * Ensure tmp directory exists for filesystem-based tests
 */
function ensureTmpDirectory() {
	mkdirSync('./tmp', { recursive: true });
}

/**
 * Get all test files for a phase (excludes setup.js and cleanup.js)
 */
function getTestFiles(phaseId) {
	const benchmarkDir = join(BENCHMARKS_DIR, phaseId);
	return readdirSync(benchmarkDir)
		.filter((f) => f.endsWith(TEST_FILE_EXTENSION) && f !== 'setup.js' && f !== 'cleanup.js')
		.sort()
		.map((f) => join(benchmarkDir, f));
}

/**
 * Run a setup or cleanup script if it exists
 */
function runPhaseScript(phaseId, scriptName) {
	const scriptPath = join(BENCHMARKS_DIR, phaseId, scriptName);
	if (existsSync(scriptPath)) {
		execSync(`node ${scriptPath}`, { stdio: 'inherit' });
		return true;
	}
	return false;
}

/**
 * Run all benchmarks for a single phase
 */
async function runPhase(phase) {
	console.log(`[${phase.id}] ${phase.title}`);

	// Run setup script if present
	runPhaseScript(phase.id, 'setup.js');

	const testFiles = getTestFiles(phase.id);
	const phaseResults = [];

	for (const testFile of testFiles) {
		const result = await runBenchmark(testFile, DEFAULT_ITERATIONS, true);
		phaseResults.push(result);

		console.log(
			`  ✓ ${result.driver} (${result.stats.median.toFixed(DECIMAL_PLACES)}ms median)`,
		);
	}

	// Run cleanup script if present
	runPhaseScript(phase.id, 'cleanup.js');

	console.log('');
	return phaseResults;
}

/**
 * Generate JSON output file
 */
function writeJsonOutput(env, allResults) {
	const jsonOutput = {
		environment: env,
		iterations: DEFAULT_ITERATIONS,
		results: allResults,
	};

	const outputPath = join(RESULTS_DIR, OUTPUT_JSON_FILE);
	writeFileSync(outputPath, JSON.stringify(jsonOutput, null, 2));
}

/**
 * Generate Markdown output file
 */
function writeMarkdownOutput(env, allResults) {
	let markdown = `${BENCHMARK_TITLE}\n\n`;
	markdown += formatEnvironmentMarkdown(env) + '\n\n';
	markdown += MARKDOWN_SEPARATOR;

	for (const phase of PHASES) {
		const results = allResults[phase.id];
		if (!results || results.length === 0) continue;

		if (phase.withOrm) {
			markdown += formatResultsTableWithORM(
				results,
				phase.title,
				phase.description,
			);
		} else {
			markdown += formatResultsTable(results, phase.title, phase.description);
		}

		markdown += MARKDOWN_SEPARATOR;
	}

	const outputPath = join(RESULTS_DIR, OUTPUT_MD_FILE);
	writeFileSync(outputPath, markdown);
}

/**
 * Main benchmark runner
 */
async function main() {
	cleanResultsDirectory();
	ensureTmpDirectory();

	console.log('📊 Running benchmarks...\n');

	const env = getEnvironmentInfo();
	const allResults = {};

	// Run all phases
	for (const phase of PHASES) {
		const results = await runPhase(phase);
		allResults[phase.id] = results;
	}

	// Write output files
	writeJsonOutput(env, allResults);
	writeMarkdownOutput(env, allResults);

	// Report completion
	const jsonPath = join(RESULTS_DIR, OUTPUT_JSON_FILE);
	const mdPath = join(RESULTS_DIR, OUTPUT_MD_FILE);

	console.log('✅ Complete! Results written to:');
	console.log(`   - ${jsonPath}`);
	console.log(`   - ${mdPath}`);
}

main().catch((error) => {
	console.error('Error running benchmarks:', error);
	process.exit(1);
});
