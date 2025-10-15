import {
	DECIMAL_PLACES,
	ORM_SUFFIX,
	VARIANT_RAW,
	VARIANT_ORM
} from './constants.js';

/**
 * Format a number with specified decimal places
 */
function fmt(num, decimals = DECIMAL_PLACES) {
	return num.toFixed(decimals);
}

/**
 * Calculate percentage difference from baseline
 */
function percentDiff(value, baseline) {
	if (baseline === 0) return 'N/A';
	const diff = ((value - baseline) / baseline) * 100;
	if (diff === 0) return '-';

	const rounded = Math.round(diff);
	// Handle -0% edge case
	if (rounded === 0) return '~0%';

	return `${diff > 0 ? '+' : ''}${rounded}%`;
}

/**
 * Extract base driver name by removing ORM suffix
 */
function getBaseDriver(driverName) {
	return driverName.replace(ORM_SUFFIX, '');
}

/**
 * Build markdown table header
 */
function buildTableHeader(includeORM = false) {
	const columns = ['#', 'Driver', 'Type', 'Median', 'Min', 'P90', 'CV'];
	if (includeORM) {
		columns.push('ORM Overhead');
	}

	const header = `| ${columns.join(' | ')} |\n`;
	const separator = `|${columns.map(() => '---').join('|')}|\n`;

	return header + separator;
}

/**
 * Build a single table row
 */
function buildTableRow(num, driver, variant, stats, ormOverhead = null) {
	let row = `| ${num} | ${driver} | ${variant} | `;
	row += `${fmt(stats.median)}ms | `;
	row += `${fmt(stats.min)}ms | `;
	row += `${fmt(stats.p90)}ms | `;
	row += `${fmt(stats.cv, 1)}% |`;

	if (ormOverhead !== null) {
		row += ` ${ormOverhead} |`;
	}

	return row + '\n';
}

/**
 * Group results by base driver for ORM comparison
 */
function groupByBaseDriver(results) {
	const groups = {};

	results.forEach((result) => {
		const baseDriver = getBaseDriver(result.driver);
		if (!groups[baseDriver]) {
			groups[baseDriver] = {};
		}
		groups[baseDriver][result.variant] = result;
	});

	return groups;
}

/**
 * Calculate ORM overhead for a given result
 */
function calculateOrmOverhead(result, driverGroups) {
	if (result.variant !== VARIANT_ORM) {
		return '-';
	}

	const baseDriver = getBaseDriver(result.driver);
	const rawResult = driverGroups[baseDriver]?.[VARIANT_RAW];

	if (!rawResult) {
		return '-';
	}

	return percentDiff(result.stats.median, rawResult.stats.median);
}

/**
 * Build results table with optional ORM overhead column
 */
function buildResultsTable(results, title, description, includeORM = false) {
	if (!results || results.length === 0) {
		return `## ${title}\n\n${description}\n\nNo results available.\n`;
	}

	// Sort by file number to match benchmark file ordering
	const sortedResults = [...results].sort((a, b) => {
		const aNum = a.fileNumber ?? 999;
		const bNum = b.fileNumber ?? 999;
		return aNum - bNum;
	});

	const driverGroups = includeORM ? groupByBaseDriver(sortedResults) : null;

	let markdown = `## ${title}\n\n${description}\n\n`;
	markdown += buildTableHeader(includeORM);

	sortedResults.forEach((result) => {
		const { driver, variant, stats, fileNumber } = result;
		const num = fileNumber ?? '?';
		const ormOverhead = includeORM ? calculateOrmOverhead(result, driverGroups) : null;

		markdown += buildTableRow(num, driver, variant, stats, ormOverhead);
	});

	return markdown + '\n';
}

/**
 * Format results as a markdown table
 */
export function formatResultsTable(results, title, description) {
	return buildResultsTable(results, title, description, false);
}

/**
 * Format results as a markdown table with ORM overhead analysis
 */
export function formatResultsTableWithORM(results, title, description) {
	return buildResultsTable(results, title, description, true);
}
