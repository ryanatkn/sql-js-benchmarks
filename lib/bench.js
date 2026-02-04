import { execSync } from 'child_process';
import { DEFAULT_ITERATIONS, PERCENTILES } from './constants.js';

/**
 * Calculate statistics from an array of timing measurements
 */
export function calculateStats(times) {
	const sorted = [...times].sort((a, b) => a - b);
	const sum = sorted.reduce((a, b) => a + b, 0);
	const len = sorted.length;

	// Calculate median (average of middle two values for even-length arrays)
	const median = len % 2 === 0
		? (sorted[len / 2 - 1] + sorted[len / 2]) / 2
		: sorted[Math.floor(len / 2)];

	// Calculate average (used for CV calculation)
	const avg = sum / len;

	// Calculate standard deviation (used for CV calculation)
	const variance = sorted.reduce((acc, val) => acc + Math.pow(val - avg, 2), 0) / len;
	const stdDev = Math.sqrt(variance);

	// Calculate coefficient of variation (CV) as percentage
	const cv = avg !== 0 ? (stdDev / avg) * 100 : 0;

	return {
		median,
		min: sorted[0],
		cv,
		p90: sorted[Math.floor(len * PERCENTILES.p90)],
	};
}

/**
 * Extract file number from test filename (e.g., "1-sqlite.js" -> 1)
 */
function extractFileNumber(testPath) {
	const filename = testPath.split('/').pop();
	const match = filename.match(/^(\d+)-/);
	return match ? parseInt(match[1], 10) : null;
}

/**
 * Run a benchmark test file in a fresh Node process (cold start)
 * Returns the timing result from the test
 */
export function runColdStart(testPath) {
	try {
		const output = execSync(`node ${testPath}`, {
			encoding: 'utf8',
			stdio: ['pipe', 'pipe', 'pipe'],
		});
		const result = JSON.parse(output.trim());

		// Add file number to result for proper table ordering
		const fileNumber = extractFileNumber(testPath);
		if (fileNumber !== null) {
			result.fileNumber = fileNumber;
		}

		return result;
	} catch (error) {
		console.error(`Error running ${testPath}:`, error.message);
		if (error.stderr) {
			console.error('stderr:', error.stderr.toString());
		}
		throw error;
	}
}

/**
 * Run a benchmark test multiple times and collect statistics
 */
export async function runBenchmark(
	testPath,
	iterations = DEFAULT_ITERATIONS,
	coldStart = true,
) {
	const results = [];

	for (let i = 0; i < iterations; i++) {
		if (coldStart) {
			const result = runColdStart(testPath);
			results.push(result);
		} else {
			// For warm runs, would need different approach
			throw new Error('Warm runs not yet implemented');
		}
	}

	// Extract just the timing values for statistics
	const times = results.map((r) => r.time_ms);
	const stats = calculateStats(times);

	// Return first result's metadata plus stats
	return {
		...results[0],
		stats,
		iterations,
	};
}
