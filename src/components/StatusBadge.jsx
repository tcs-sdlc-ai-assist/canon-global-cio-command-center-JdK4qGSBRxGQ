import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../app.config';

const STATUS_STYLES = {
  excellent: {
    backgroundColor: '#DFF6DD',
    color: '#0B5C0B',
    borderColor: '#A7E0A5',
    label: 'Excellent',
  },
  good: {
    backgroundColor: '#E8F4FD',
    color: '#004578',
    borderColor: '#B3D9F2',
    label: 'Good',
  },
  warning: {
    backgroundColor: '#FFF4CE',
    color: '#8A6100',
    borderColor: '#FFE68F',
    label: 'Warning',
  },
  critical: {
    backgroundColor: '#FDE7E9',
    color: '#A4262C',
    borderColor: '#F7B7BB',
    label: 'Critical',
  },
};

function getStatusStyle(status) {
  return STATUS_STYLES[status] || STATUS_STYLES.good;
}

export function StatusBadge({ status = 'good', label, size = 'md', className = '' }) {
  const style = getStatusStyle(status);
  const displayLabel = label || style.label;

  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px]',
    md: 'px-2 py-0.5 text-xs',
    lg: 'px-2.5 py-1 text-sm',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full border ${sizeClasses[size]} ${className}`}
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderColor,
      }}
      role="status"
      aria-label={`Status: ${displayLabel}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5 flex-shrink-0"
        style={{ backgroundColor: style.color }}
        aria-hidden="true"
      />
      {displayLabel}
    </span>
  );
}

StatusBadge.propTypes = {
  status: PropTypes.oneOf(['excellent', 'good', 'warning', 'critical']),
  label: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};