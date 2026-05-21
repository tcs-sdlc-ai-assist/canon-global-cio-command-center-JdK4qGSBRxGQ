const LOG_LEVELS = {
  INFO: 'INFO',
  WARN: 'WARN',
  ERROR: 'ERROR',
  EVENT: 'EVENT',
};

const LOG_LEVEL_PRIORITY = {
  EVENT: 0,
  INFO: 1,
  WARN: 2,
  ERROR: 3,
};

const CURRENT_LOG_LEVEL = LOG_LEVELS.INFO;

/**
 * Formats a log entry with timestamp, level, and message.
 * @param {string} level - The log level (INFO, WARN, ERROR, EVENT)
 * @param {string} component - The component or module name
 * @param {string} action - The action or event description
 * @param {object} [details] - Optional additional details
 * @returns {string} Formatted log string
 */
function formatLogEntry(level, component, action, details) {
  const timestamp = new Date().toISOString();
  const detailString = details ? ` ${JSON.stringify(details)}` : '';
  return `[${timestamp}][${level}][${component}] ${action}${detailString}`;
}

/**
 * Determines if a log message should be output based on the current log level.
 * @param {string} level - The log level to check
 * @returns {boolean} Whether the message should be logged
 */
function shouldLog(level) {
  return LOG_LEVEL_PRIORITY[level] >= LOG_LEVEL_PRIORITY[CURRENT_LOG_LEVEL];
}

/**
 * Logs a message at the specified level.
 * @param {string} level - The log level
 * @param {string} component - The component or module name
 * @param {string} action - The action or event description
 * @param {object} [details] - Optional additional details
 */
export function log(level, component, action, details) {
  if (!shouldLog(level)) {
    return;
  }

  const message = formatLogEntry(level, component, action, details);

  switch (level) {
    case LOG_LEVELS.ERROR:
      console.error(message);
      break;
    case LOG_LEVELS.WARN:
      console.warn(message);
      break;
    case LOG_LEVELS.INFO:
    case LOG_LEVELS.EVENT:
    default:
      console.log(message);
      break;
  }
}

/**
 * Logs a tab switch event.
 * @param {string} tabId - The ID of the tab being switched to
 * @param {string} previousTabId - The ID of the previous tab
 */
export function logTabSwitch(tabId, previousTabId) {
  log(LOG_LEVELS.EVENT, 'Navigation', 'Tab switch', {
    from: previousTabId,
    to: tabId,
  });
}

/**
 * Logs an action chip click event.
 * @param {string} label - The label of the clicked chip
 * @param {string} source - The source section of the chip
 */
export function logChipClick(label, source) {
  log(LOG_LEVELS.EVENT, 'ActionChip', 'Chip clicked', {
    label,
    source,
  });
}

/**
 * Logs a chat message event.
 * @param {string} role - The role of the message sender ('user' or 'assistant')
 * @param {string} content - The message content (truncated for logging)
 */
export function logChatMessage(role, content) {
  const truncatedContent = content.length > 100
    ? `${content.substring(0, 100)}...`
    : content;

  log(LOG_LEVELS.EVENT, 'Chat', 'Message sent', {
    role,
    contentLength: content.length,
    preview: truncatedContent,
  });
}

/**
 * Logs an export event.
 * @param {string} format - The export format (e.g., 'csv')
 * @param {number} rowCount - The number of rows exported
 */
export function logExport(format, rowCount) {
  log(LOG_LEVELS.EVENT, 'Export', 'Data exported', {
    format,
    rowCount,
  });
}

/**
 * Logs a predictive analysis event.
 * @param {string} action - The action performed (e.g., 'open', 'close', 'view')
 */
export function logPredictiveAnalysis(action) {
  log(LOG_LEVELS.EVENT, 'PredictiveAnalysis', 'Analysis action', {
    action,
  });
}

/**
 * Logs a data loading event.
 * @param {string} status - The loading status ('start', 'success', 'error')
 * @param {object} [details] - Optional details about the loading operation
 */
export function logDataLoad(status, details) {
  log(
    status === 'error' ? LOG_LEVELS.ERROR : LOG_LEVELS.INFO,
    'DataContext',
    `Data load ${status}`,
    details
  );
}