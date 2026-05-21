import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { useData } from '../context/DataContext';
import { useUI } from '../context/UIProvider';
import { generateCSV, downloadCSV } from '../services/csvGenerator';
import { logExport } from '../services/logger';
import { COLORS } from '../app.config';

const EXPORT_DELAY = 1500;

export function ExportButton({ className = '', label = 'Export Data' }) {
  const { data } = useData();
  const { addToast } = useUI();
  const [isLoading, setIsLoading] = useState(false);

  const handleExport = useCallback(async () => {
    if (isLoading || !data) return;

    setIsLoading(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, EXPORT_DELAY));

      const csvContent = generateCSV(data);
      const rowCount = csvContent.split('\n').length - 1;

      downloadCSV(csvContent);

      logExport('csv', rowCount);

      addToast({
        type: 'success',
        title: 'Export Complete',
        message: `Dashboard data exported successfully (${rowCount} rows).`,
      });
    } catch (error) {
      console.error('Export failed:', error);

      addToast({
        type: 'error',
        title: 'Export Failed',
        message: 'Failed to export dashboard data. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
  }, [data, isLoading, addToast]);

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isLoading || !data}
      aria-label={isLoading ? 'Preparing export...' : 'Export dashboard data as CSV'}
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium
        rounded-md border transition-all duration-150 ease-out
        focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:ring-offset-1
        active:scale-95
        ${
          isLoading || !data
            ? 'bg-[#F3F2F1] text-[#605E5C] border-[#EDEBE9] cursor-not-allowed'
            : 'bg-white text-[#323130] border-[#EDEBE9] hover:bg-gray-50 hover:border-gray-300'
        }
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg
            className="animate-spin h-4 w-4 text-[#605E5C]"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span>Preparing...</span>
        </>
      ) : (
        <>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}

ExportButton.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
};