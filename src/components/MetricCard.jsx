import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../app.config';

function TrendArrow({ direction, percentage, label }) {
  if (!direction || direction === 'stable') {
    return (
      <div className="flex items-center gap-1.5">
        <svg
          className="w-3.5 h-3.5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M5 12h14"
          />
        </svg>
        {percentage != null && (
          <span className="text-xs font-medium text-gray-400">
            {percentage}%
          </span>
        )}
        {label && (
          <span className="text-xs text-gray-400">{label}</span>
        )}
      </div>
    );
  }

  const isUp = direction === 'up';
  const trendColor = isUp ? '#107C10' : '#D13438';

  return (
    <div className="flex items-center gap-1.5">
      <svg
        className={`w-3.5 h-3.5 ${isUp ? '' : 'rotate-180'}`}
        style={{ color: trendColor }}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
      {percentage != null && (
        <span className="text-xs font-semibold" style={{ color: trendColor }}>
          {isUp ? '+' : '-'}{percentage}%
        </span>
      )}
      {label && (
        <span className="text-xs text-gray-400">{label}</span>
      )}
    </div>
  );
}

TrendArrow.propTypes = {
  direction: PropTypes.oneOf(['up', 'down', 'stable']),
  percentage: PropTypes.number,
  label: PropTypes.string,
};

function AIPulseDot() {
  return (
    <span className="relative inline-flex h-2 w-2" aria-hidden="true">
      <span
        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
        style={{ backgroundColor: COLORS.PRIMARY }}
      />
      <span
        className="relative inline-flex rounded-full h-2 w-2"
        style={{ backgroundColor: COLORS.PRIMARY }}
      />
    </span>
  );
}

export function MetricCard({
  title,
  value,
  prefix = '',
  suffix = '',
  trend,
  insight,
  category = 'business',
  className = '',
}) {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
  }, []);

  const formattedValue = typeof value === 'number'
    ? value.toLocaleString('en-US', { maximumFractionDigits: 2 })
    : value;

  const categoryBorderColors = {
    business: 'border-l-[#0070C0]',
    operations: 'border-l-[#107C10]',
    risk: 'border-l-[#D13438]',
    innovation: 'border-l-[#FF8C00]',
    partnership: 'border-l-[#6264A7]',
  };

  const borderColor = categoryBorderColors[category] || categoryBorderColors.business;

  return (
    <div
      className={`
        relative bg-white rounded-lg border border-[#EDEBE9] border-l-4 ${borderColor}
        transition-all duration-200 ease-out
        ${isHovered ? 'shadow-lg -translate-y-0.5' : 'shadow-sm'}
        ${className}
      `}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="article"
      aria-label={`Metric card: ${title}`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xs font-medium text-[#605E5C] uppercase tracking-wider truncate pr-2">
            {title}
          </h3>
          {insight && (
            <div className="flex-shrink-0 mt-0.5" title="AI Analysis available" aria-label="AI insight available">
              <AIPulseDot />
            </div>
          )}
        </div>

        <div className="flex items-baseline gap-1 mb-2">
          {prefix && (
            <span className="text-sm font-medium text-[#605E5C]">{prefix}</span>
          )}
          <span className="text-2xl font-bold text-[#323130] tracking-tight">
            {formattedValue}
          </span>
          {suffix && (
            <span className="text-sm font-medium text-[#605E5C]">{suffix}</span>
          )}
        </div>

        {trend && (
          <div className="mb-2">
            <TrendArrow
              direction={trend.direction}
              percentage={trend.percentage}
              label={trend.label}
            />
          </div>
        )}

        {insight && (
          <div
            className={`
              mt-3 pt-3 border-t border-[#EDEBE9]
              transition-all duration-200 ease-out
              ${isHovered ? 'opacity-100' : 'opacity-80'}
            `}
          >
            <div className="flex items-start gap-2">
              <span className="text-xs text-[#0070C0] mt-0.5 flex-shrink-0" aria-hidden="true">💡</span>
              <p className="text-xs text-[#605E5C] leading-relaxed">
                {insight}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

MetricCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  trend: PropTypes.shape({
    direction: PropTypes.oneOf(['up', 'down', 'stable']).isRequired,
    percentage: PropTypes.number.isRequired,
    label: PropTypes.string,
  }),
  insight: PropTypes.string,
  category: PropTypes.oneOf(['business', 'operations', 'risk', 'innovation', 'partnership']),
  className: PropTypes.string,
};