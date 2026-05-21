import { log } from '../utils/logger';

/**
 * Generates a CSV string from dashboard data.
 * @param {Object} data - The dashboard data object containing metrics per tab
 * @returns {string} Formatted CSV string
 */
export function generateCSV(data) {
  if (!data) {
    log('WARN', 'CSV Generator', 'No data provided for CSV generation');
    return '';
  }

  const headers = ['Metric', 'Value', 'Trend', 'Change', 'Category'];
  const rows = [];

  const tabCategories = {
    strategicCommand: 'Strategic Command',
    businessImpact: 'Business Impact',
    operations: 'Operations',
    riskGovernance: 'Risk & Governance',
    innovation: 'Innovation',
    partnerships: 'Partnerships',
  };

  for (const [tabKey, category] of Object.entries(tabCategories)) {
    const tabData = data[tabKey];
    if (!tabData || !tabData.metrics || !Array.isArray(tabData.metrics)) {
      continue;
    }

    for (const metric of tabData.metrics) {
      const value = metric.prefix
        ? `${metric.prefix}${metric.value}${metric.suffix || ''}`
        : `${metric.value}${metric.suffix || ''}`;

      const trend = metric.trend?.direction || 'stable';
      const change = metric.trend?.percentage
        ? `${metric.trend.direction === 'up' ? '+' : metric.trend.direction === 'down' ? '-' : ''}${metric.trend.percentage}%`
        : '';

      rows.push([
        escapeCSVField(metric.title),
        escapeCSVField(value),
        escapeCSVField(trend),
        escapeCSVField(change),
        escapeCSVField(category),
      ]);
    }
  }

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  log('INFO', 'CSV Generator', `Generated CSV with ${rows.length} rows`);
  return csvContent;
}

/**
 * Escapes a field value for CSV format.
 * Wraps in quotes if the value contains commas, quotes, or newlines.
 * @param {string} value - The field value to escape
 * @returns {string} Escaped CSV field value
 */
function escapeCSVField(value) {
  if (value === null || value === undefined) {
    return '';
  }

  const stringValue = String(value);

  if (
    stringValue.includes(',') ||
    stringValue.includes('"') ||
    stringValue.includes('\n') ||
    stringValue.includes('\r')
  ) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }

  return stringValue;
}

/**
 * Triggers a CSV file download in the browser.
 * @param {string} csvContent - The CSV string content
 * @param {string} filename - The desired filename (without extension)
 */
export function downloadCSV(csvContent, filename = 'cio-dashboard-export') {
  if (!csvContent) {
    log('WARN', 'CSV Download', 'No CSV content to download');
    return;
  }

  try {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}-${formatDateForFilename(new Date())}.csv`;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();

    // Cleanup
    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 100);

    log('INFO', 'CSV Download', `Downloaded ${link.download}`);
  } catch (error) {
    log('ERROR', 'CSV Download', `Download failed: ${error.message}`);
    throw new Error('Failed to download CSV file. Please try again.');
  }
}

/**
 * Formats a date for use in a filename (YYYY-MM-DD).
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
function formatDateForFilename(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}