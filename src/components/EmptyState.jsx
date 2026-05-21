import React from 'react';
import PropTypes from 'prop-types';

export function EmptyState({ title = 'No data available', message = 'There is no data to display for this section.', icon = '📭', className = '', children }) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] p-8 ${className}`} role="status">
      <div className="text-center max-w-md">
        <div className="text-4xl mb-4" aria-hidden="true">{icon}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-500 text-sm mb-6">{message}</p>
        {children && <div className="mt-4">{children}</div>}
      </div>
    </div>
  );
}

EmptyState.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
  icon: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node,
};