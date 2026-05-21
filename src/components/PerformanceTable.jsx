import React from 'react';
import PropTypes from 'prop-types';
import { StatusBadge } from './StatusBadge';
import { COLORS } from '../app.config';

const METRIC_COLUMNS = [
  { key: 'businessImpact', label: 'Business Impact' },
  { key: 'operationalExcellence', label: 'Operational Excellence' },
  { key: 'innovation', label: 'Innovation' },
  { key: 'riskCompliance', label: 'Risk & Compliance' },
  { key: 'partnershipHealth', label: 'Partnership Health' },
];

function getScoreColor(value) {
  if (value >= 90) return COLORS.SUCCESS;
  if (value >= 75) return COLORS.PRIMARY;
  if (value >= 60) return COLORS.WARNING;
  return COLORS.DANGER;
}

function getStatusFromScore(value) {
  if (value >= 90) return 'excellent';
  if (value >= 75) return 'good';
  if (value >= 60) return 'warning';
  return 'critical';
}

function MetricCell({ value }) {
  const scoreColor = getScoreColor(value);
  const status = getStatusFromScore(value);

  return (
    <td className="px-4 py-3 whitespace-nowrap">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 min-w-[60px]">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: scoreColor }}
            aria-hidden="true"
          />
          <span className="text-sm font-semibold text-[#323130] tabular-nums">
            {value}
          </span>
        </div>
        <StatusBadge status={status} size="sm" />
      </div>
    </td>
  );
}

MetricCell.propTypes = {
  value: PropTypes.number.isRequired,
};

export function PerformanceTable({ regions = [], className = '' }) {
  if (!regions || regions.length === 0) {
    return (
      <div className={`bg-white rounded-lg border border-[#EDEBE9] shadow-sm p-6 ${className}`}>
        <p className="text-sm text-[#605E5C] text-center">No regional performance data available.</p>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg border border-[#EDEBE9] shadow-sm overflow-hidden ${className}`}>
      <div className="overflow-x-auto">
        <table className="w-full" role="table" aria-label="Regional performance summary">
          <thead>
            <tr className="border-b border-[#EDEBE9] bg-[#FAF9F8]">
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-[#605E5C] uppercase tracking-wider whitespace-nowrap"
                scope="col"
              >
                Region
              </th>
              {METRIC_COLUMNS.map((column) => (
                <th
                  key={column.key}
                  className="px-4 py-3 text-left text-xs font-semibold text-[#605E5C] uppercase tracking-wider whitespace-nowrap"
                  scope="col"
                >
                  {column.label}
                </th>
              ))}
              <th
                className="px-4 py-3 text-left text-xs font-semibold text-[#605E5C] uppercase tracking-wider whitespace-nowrap"
                scope="col"
              >
                Overall
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#EDEBE9]">
            {regions.map((region) => {
              const metrics = region.metrics || {};
              const overallStatus = region.overallStatus || 'good';

              return (
                <tr
                  key={region.name}
                  className="hover:bg-[#FAF9F8] transition-colors"
                  role="row"
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span className="text-sm font-medium text-[#323130]">
                      {region.name}
                    </span>
                  </td>
                  {METRIC_COLUMNS.map((column) => {
                    const metric = metrics[column.key];
                    const value = metric?.value ?? 0;
                    return <MetricCell key={column.key} value={value} />;
                  })}
                  <td className="px-4 py-3 whitespace-nowrap">
                    <StatusBadge status={overallStatus} size="sm" />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

PerformanceTable.propTypes = {
  regions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      metrics: PropTypes.shape({
        businessImpact: PropTypes.shape({
          value: PropTypes.number,
          status: PropTypes.string,
        }),
        operationalExcellence: PropTypes.shape({
          value: PropTypes.number,
          status: PropTypes.string,
        }),
        innovation: PropTypes.shape({
          value: PropTypes.number,
          status: PropTypes.string,
        }),
        riskCompliance: PropTypes.shape({
          value: PropTypes.number,
          status: PropTypes.string,
        }),
        partnershipHealth: PropTypes.shape({
          value: PropTypes.number,
          status: PropTypes.string,
        }),
      }),
      overallStatus: PropTypes.oneOf(['excellent', 'good', 'warning', 'critical']),
    })
  ),
  className: PropTypes.string,
};