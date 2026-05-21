import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { ActionChip } from './ActionChip';
import { AIPulseIndicator } from './AIPulseIndicator';

export function QuickActionBar({ actions = [], title = 'Strategic Recommendations', className = '' }) {
  if (!actions || actions.length === 0) {
    return null;
  }

  return (
    <div
      className={`bg-white rounded-lg border border-[#EDEBE9] shadow-sm ${className}`}
      role="region"
      aria-label={title}
    >
      <div className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <AIPulseIndicator />
          <h3 className="text-sm font-semibold text-[#323130]">{title}</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {actions.map((action) => (
            <ActionChip
              key={action.id || action.label}
              label={action.label}
              variant={action.variant || 'primary'}
              icon={action.icon}
              ariaLabel={`Quick action: ${action.label}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

QuickActionBar.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      variant: PropTypes.oneOf(['primary', 'secondary', 'insight']),
      icon: PropTypes.string,
    })
  ),
  title: PropTypes.string,
  className: PropTypes.string,
};