import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { AIPulseIndicator } from './AIPulseIndicator';
import { ActionChip } from './ActionChip';
import { COLORS } from '../app.config';

function ConfidenceBadge({ confidence }) {
  const badgeColors = {
    high: {
      backgroundColor: '#DFF6DD',
      color: '#0B5C0B',
      borderColor: '#A7E0A5',
      label: 'High Confidence',
    },
    medium: {
      backgroundColor: '#FFF4CE',
      color: '#8A6100',
      borderColor: '#FFE68F',
      label: 'Medium Confidence',
    },
    low: {
      backgroundColor: '#FDE7E9',
      color: '#A4262C',
      borderColor: '#F7B7BB',
      label: 'Low Confidence',
    },
  };

  const style = badgeColors[confidence] || badgeColors.medium;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-medium rounded-full border"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderColor,
      }}
      role="status"
      aria-label={`AI confidence: ${style.label}`}
    >
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: style.color }}
        aria-hidden="true"
      />
      {style.label}
    </span>
  );
}

ConfidenceBadge.propTypes = {
  confidence: PropTypes.oneOf(['high', 'medium', 'low']),
};

function InsightBox({ title, narrative, metrics, actions, className = '' }) {
  return (
    <div
      className={`bg-white rounded-lg border border-[#EDEBE9] shadow-sm ${className}`}
      role="region"
      aria-label={title}
    >
      <div className="p-4">
        <h4 className="text-sm font-semibold text-[#323130] mb-2">{title}</h4>
        <p className="text-xs text-[#605E5C] leading-relaxed mb-3">{narrative}</p>

        {metrics && Object.keys(metrics).length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {Object.entries(metrics).map(([key, value]) => (
              <span
                key={key}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#F3F2F1] rounded text-[10px] font-medium text-[#605E5C]"
              >
                <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                <span className="text-[#323130]">{value}</span>
              </span>
            ))}
          </div>
        )}

        {actions && actions.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <ActionChip
                key={action.id || action.label}
                label={action.label}
                variant="insight"
                icon={action.icon}
                ariaLabel={`AI insight action: ${action.label}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

InsightBox.propTypes = {
  title: PropTypes.string.isRequired,
  narrative: PropTypes.string.isRequired,
  metrics: PropTypes.objectOf(PropTypes.string),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ),
  className: PropTypes.string,
};

export function InsightPanel({
  confidence = 'high',
  strategicPriorities = [],
  executiveActions = [],
  insightBoxes = [],
  title = 'AI Intelligence',
  className = '',
}) {
  return (
    <div
      className={`bg-[#FAF9F8] rounded-lg border border-[#EDEBE9] ${className}`}
      role="region"
      aria-label="AI intelligence panel"
    >
      <div className="p-4 border-b border-[#EDEBE9]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <AIPulseIndicator />
            <h3 className="text-sm font-semibold text-[#323130]">{title}</h3>
          </div>
          <ConfidenceBadge confidence={confidence} />
        </div>

        {strategicPriorities.length > 0 && (
          <div className="mb-3">
            <h4 className="text-xs font-medium text-[#605E5C] uppercase tracking-wider mb-2">
              Strategic Priorities
            </h4>
            <ul className="space-y-1.5">
              {strategicPriorities.map((priority, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-xs text-[#323130]"
                >
                  <span
                    className="mt-1 w-1.5 h-1.5 rounded-full flex-shrink-0"
                    style={{ backgroundColor: COLORS.PRIMARY }}
                    aria-hidden="true"
                  />
                  <span className="leading-relaxed">{priority}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {executiveActions.length > 0 && (
          <div>
            <h4 className="text-xs font-medium text-[#605E5C] uppercase tracking-wider mb-2">
              Executive Actions
            </h4>
            <div className="flex flex-wrap gap-2">
              {executiveActions.map((action) => (
                <ActionChip
                  key={action.id || action.label}
                  label={action.label}
                  variant="primary"
                  icon={action.icon}
                  ariaLabel={`Executive action: ${action.label}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {insightBoxes.length > 0 && (
        <div className="p-4 space-y-3">
          {insightBoxes.map((box, index) => (
            <InsightBox
              key={box.id || index}
              title={box.title}
              narrative={box.narrative}
              metrics={box.metrics}
              actions={box.actions}
            />
          ))}
        </div>
      )}
    </div>
  );
}

InsightPanel.propTypes = {
  confidence: PropTypes.oneOf(['high', 'medium', 'low']),
  strategicPriorities: PropTypes.arrayOf(PropTypes.string),
  executiveActions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
    })
  ),
  insightBoxes: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string,
      title: PropTypes.string.isRequired,
      narrative: PropTypes.string.isRequired,
      metrics: PropTypes.objectOf(PropTypes.string),
      actions: PropTypes.arrayOf(
        PropTypes.shape({
          id: PropTypes.string,
          label: PropTypes.string.isRequired,
          icon: PropTypes.string,
        })
      ),
    })
  ),
  title: PropTypes.string,
  className: PropTypes.string,
};