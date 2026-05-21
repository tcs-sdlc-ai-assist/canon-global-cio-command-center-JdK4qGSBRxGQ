import React, { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../app.config';
import { logPredictiveAnalysis } from '../services/logger';

const FORECAST_METRICS = [
  {
    id: 'forecast-revenue-growth',
    title: 'Projected IT-Enabled Revenue Growth',
    currentValue: 2.4,
    currentUnit: 'billion',
    currentPrefix: '€',
    projectedValue: 3.1,
    projectedUnit: 'billion',
    projectedPrefix: '€',
    confidence: 85,
    trend: 'up',
    insight: 'Based on current trajectory and planned digital initiatives, revenue attribution is projected to reach €3.1B by Q4 2025, driven by APAC expansion and AI-driven sales optimization.',
  },
  {
    id: 'forecast-cost-avoidance',
    title: 'Projected Cost Avoidance',
    currentValue: 184,
    currentUnit: 'million',
    currentPrefix: '€',
    projectedValue: 250,
    projectedUnit: 'million',
    projectedPrefix: '€',
    confidence: 78,
    trend: 'up',
    insight: 'Automation and cloud optimization initiatives are expected to increase cost avoidance to €250M annually, with RPA and AIOps contributing the largest share.',
  },
  {
    id: 'forecast-innovation-roi',
    title: 'Projected Innovation ROI',
    currentValue: 285,
    currentUnit: 'percent',
    currentSuffix: '%',
    projectedValue: 340,
    projectedUnit: 'percent',
    projectedSuffix: '%',
    confidence: 72,
    trend: 'up',
    insight: 'Innovation ROI is forecast to reach 340% as AI/ML models scale across supply chain and customer service domains, with quantum computing pilots beginning to show early returns.',
  },
  {
    id: 'forecast-ai-models',
    title: 'Projected AI/ML Models in Production',
    currentValue: 47,
    projectedValue: 85,
    confidence: 80,
    trend: 'up',
    insight: 'With the AI Center of Excellence expansion, production AI/ML models are projected to grow to 85 by end of year, focusing on computer vision, NLP, and predictive analytics.',
  },
  {
    id: 'forecast-cybersecurity',
    title: 'Projected Cybersecurity Maturity',
    currentValue: 87,
    currentSuffix: '/100',
    projectedValue: 94,
    projectedSuffix: '/100',
    confidence: 88,
    trend: 'up',
    insight: 'Zero-trust architecture rollout and enhanced threat detection are expected to push cybersecurity maturity to 94/100, exceeding industry benchmarks.',
  },
  {
    id: 'forecast-system-availability',
    title: 'Projected System Availability',
    currentValue: 99.97,
    currentUnit: 'percent',
    currentSuffix: '%',
    projectedValue: 99.99,
    projectedUnit: 'percent',
    projectedSuffix: '%',
    confidence: 92,
    trend: 'up',
    insight: 'Infrastructure redundancy upgrades and AI-driven incident prevention are forecast to achieve 99.99% availability, representing near-zero downtime.',
  },
  {
    id: 'forecast-digital-transformation',
    title: 'Projected Digital Transformation Progress',
    currentValue: 76,
    currentUnit: 'percent',
    currentSuffix: '%',
    projectedValue: 92,
    projectedUnit: 'percent',
    projectedSuffix: '%',
    confidence: 82,
    trend: 'up',
    insight: 'Cloud migration and legacy modernization efforts are on track to reach 92% completion, with Tier 1 applications fully migrated by Q3 2025.',
  },
  {
    id: 'forecast-sustainability',
    title: 'Projected Sustainability Index',
    currentValue: 82.1,
    currentUnit: 'percent',
    currentSuffix: '%',
    projectedValue: 90.5,
    projectedUnit: 'percent',
    projectedSuffix: '%',
    confidence: 76,
    trend: 'up',
    insight: 'Data center efficiency programs and green IT initiatives are projected to raise the sustainability index to 90.5%, with carbon footprint reduction exceeding 35% year-over-year.',
  },
];

const SCENARIO_ANALYSIS = {
  optimistic: {
    label: 'Optimistic',
    description: 'Accelerated digital transformation with full AI/ML adoption across all business units',
    revenueImpact: '+18%',
    costSavings: '€320M',
    probability: 25,
  },
  baseline: {
    label: 'Baseline',
    description: 'Current trajectory maintained with planned initiatives on schedule',
    revenueImpact: '+12%',
    costSavings: '€250M',
    probability: 55,
  },
  conservative: {
    label: 'Conservative',
    description: 'Delayed initiatives and budget constraints limiting transformation pace',
    revenueImpact: '+7%',
    costSavings: '€180M',
    probability: 20,
  },
};

const KEY_RISKS = [
  {
    id: 'risk-1',
    description: 'Talent shortage in AI/ML and cybersecurity domains may delay projected timelines',
    impact: 'high',
    mitigation: 'Accelerate upskilling programs and expand partnerships with universities',
  },
  {
    id: 'risk-2',
    description: 'Regulatory changes in data sovereignty could impact cloud migration plans',
    impact: 'medium',
    mitigation: 'Proactive engagement with regulatory bodies and flexible architecture design',
  },
  {
    id: 'risk-3',
    description: 'Economic uncertainty may reduce innovation budget allocation',
    impact: 'medium',
    mitigation: 'Focus on high-ROI initiatives and build business cases with clear value metrics',
  },
  {
    id: 'risk-4',
    description: 'Vendor lock-in risk with strategic partners could limit flexibility',
    impact: 'low',
    mitigation: 'Multi-vendor strategy and open standards adoption in architecture decisions',
  },
];

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

  let level = 'medium';
  if (confidence >= 85) {
    level = 'high';
  } else if (confidence < 70) {
    level = 'low';
  }

  const style = badgeColors[level];

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium rounded-full border"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderColor,
      }}
      role="status"
      aria-label={`Confidence: ${style.label}`}
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
  confidence: PropTypes.number.isRequired,
};

function ImpactBadge({ impact }) {
  const impactStyles = {
    high: {
      backgroundColor: '#FDE7E9',
      color: '#A4262C',
      borderColor: '#F7B7BB',
      label: 'High Impact',
    },
    medium: {
      backgroundColor: '#FFF4CE',
      color: '#8A6100',
      borderColor: '#FFE68F',
      label: 'Medium Impact',
    },
    low: {
      backgroundColor: '#DFF6DD',
      color: '#0B5C0B',
      borderColor: '#A7E0A5',
      label: 'Low Impact',
    },
  };

  const style = impactStyles[impact] || impactStyles.medium;

  return (
    <span
      className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-medium rounded-full border"
      style={{
        backgroundColor: style.backgroundColor,
        color: style.color,
        borderColor: style.borderColor,
      }}
      role="status"
      aria-label={`Risk impact: ${style.label}`}
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

ImpactBadge.propTypes = {
  impact: PropTypes.oneOf(['high', 'medium', 'low']).isRequired,
};

function ForecastMetricCard({ metric }) {
  const currentDisplay = metric.currentPrefix
    ? `${metric.currentPrefix}${metric.currentValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}${metric.currentSuffix || ''}`
    : `${metric.currentValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}${metric.currentSuffix || ''}`;

  const projectedDisplay = metric.projectedPrefix
    ? `${metric.projectedPrefix}${metric.projectedValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}${metric.projectedSuffix || ''}`
    : `${metric.projectedValue.toLocaleString('en-US', { maximumFractionDigits: 2 })}${metric.projectedSuffix || ''}`;

  return (
    <div className="bg-white rounded-lg border border-[#EDEBE9] shadow-sm p-4">
      <div className="flex items-start justify-between mb-3">
        <h4 className="text-sm font-semibold text-[#323130] pr-2">{metric.title}</h4>
        <ConfidenceBadge confidence={metric.confidence} />
      </div>

      <div className="flex items-center gap-4 mb-3">
        <div className="flex-1">
          <p className="text-[10px] font-medium text-[#605E5C] uppercase tracking-wider mb-1">Current</p>
          <p className="text-lg font-bold text-[#323130]">{currentDisplay}</p>
        </div>
        <div className="flex-shrink-0 flex items-center justify-center">
          <svg
            className="w-5 h-5 text-[#0070C0]"
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
              d="M13 7l5 5m0 0l-5 5m5-5H6"
            />
          </svg>
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-medium text-[#605E5C] uppercase tracking-wider mb-1">Projected</p>
          <p className="text-lg font-bold text-[#0070C0]">{projectedDisplay}</p>
        </div>
      </div>

      <p className="text-xs text-[#605E5C] leading-relaxed">{metric.insight}</p>
    </div>
  );
}

ForecastMetricCard.propTypes = {
  metric: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    currentValue: PropTypes.number.isRequired,
    currentUnit: PropTypes.string,
    currentPrefix: PropTypes.string,
    currentSuffix: PropTypes.string,
    projectedValue: PropTypes.number.isRequired,
    projectedUnit: PropTypes.string,
    projectedPrefix: PropTypes.string,
    projectedSuffix: PropTypes.string,
    confidence: PropTypes.number.isRequired,
    trend: PropTypes.string,
    insight: PropTypes.string.isRequired,
  }).isRequired,
};

function ScenarioCard({ scenarioKey, scenario }) {
  const probabilityColor = scenario.probability >= 50 ? COLORS.SUCCESS : scenario.probability >= 25 ? COLORS.WARNING : COLORS.DANGER;

  return (
    <div className="bg-white rounded-lg border border-[#EDEBE9] shadow-sm p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-semibold text-[#323130]">{scenario.label}</h4>
        <span
          className="inline-flex items-center px-2 py-0.5 text-xs font-medium rounded-full"
          style={{
            backgroundColor: `${probabilityColor}15`,
            color: probabilityColor,
          }}
          aria-label={`Probability: ${scenario.probability}%`}
        >
          {scenario.probability}%
        </span>
      </div>
      <p className="text-xs text-[#605E5C] leading-relaxed mb-3">{scenario.description}</p>
      <div className="flex items-center gap-4 text-xs">
        <div>
          <span className="text-[#605E5C]">Revenue Impact: </span>
          <span className="font-semibold text-[#323130]">{scenario.revenueImpact}</span>
        </div>
        <div>
          <span className="text-[#605E5C]">Cost Savings: </span>
          <span className="font-semibold text-[#323130]">{scenario.costSavings}</span>
        </div>
      </div>
    </div>
  );
}

ScenarioCard.propTypes = {
  scenarioKey: PropTypes.string.isRequired,
  scenario: PropTypes.shape({
    label: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    revenueImpact: PropTypes.string.isRequired,
    costSavings: PropTypes.string.isRequired,
    probability: PropTypes.number.isRequired,
  }).isRequired,
};

function RiskCard({ risk }) {
  return (
    <div className="bg-white rounded-lg border border-[#EDEBE9] shadow-sm p-4">
      <div className="flex items-start justify-between mb-2">
        <p className="text-xs text-[#323130] leading-relaxed pr-2">{risk.description}</p>
        <ImpactBadge impact={risk.impact} />
      </div>
      <div className="flex items-start gap-2">
        <svg
          className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[#0070C0]"
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
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <p className="text-[10px] text-[#605E5C] leading-relaxed">
          <span className="font-medium">Mitigation: </span>
          {risk.mitigation}
        </p>
      </div>
    </div>
  );
}

RiskCard.propTypes = {
  risk: PropTypes.shape({
    id: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    impact: PropTypes.oneOf(['high', 'medium', 'low']).isRequired,
    mitigation: PropTypes.string.isRequired,
  }).isRequired,
};

export function PredictiveModal({ isOpen, onClose, className = '' }) {
  const modalRef = useRef(null);
  const previousActiveElement = useRef(null);

  const handleClose = useCallback(() => {
    logPredictiveAnalysis('close');
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
      if (e.key === 'Tab') {
        const focusableElements = modalRef.current?.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements && focusableElements.length > 0) {
          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          if (e.shiftKey && document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          } else if (!e.shiftKey && document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    },
    [handleClose]
  );

  useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      logPredictiveAnalysis('open');
      document.body.style.overflow = 'hidden';
      modalRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      if (previousActiveElement.current) {
        previousActiveElement.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, handleKeyDown]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-start justify-center overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label="Predictive Analysis"
      aria-hidden={!isOpen}
    >
      <div
        className="fixed inset-0 bg-black/40 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      <div
        ref={modalRef}
        tabIndex={-1}
        className={`
          relative w-full max-w-4xl mx-4 my-8 bg-[#FAF9F8] rounded-xl shadow-2xl
          border border-[#EDEBE9] overflow-hidden
          ${className}
        `}
      >
        <div
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b border-[#EDEBE9]"
          style={{ backgroundColor: COLORS.PRIMARY }}
        >
          <div className="flex items-center gap-3">
            <svg
              className="w-6 h-6 text-white"
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
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
            <div>
              <h2 className="text-lg font-semibold text-white">Predictive Analysis</h2>
              <p className="text-xs text-white/80">Forecast projections based on current trajectory and planned initiatives</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-1 transition-colors"
            aria-label="Close predictive analysis"
          >
            <svg
              className="w-5 h-5"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-8">
          <section>
            <h3 className="text-base font-semibold text-[#323130] mb-4">Forecast Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {FORECAST_METRICS.map((metric) => (
                <ForecastMetricCard key={metric.id} metric={metric} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#323130] mb-4">Scenario Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {Object.entries(SCENARIO_ANALYSIS).map(([key, scenario]) => (
                <ScenarioCard key={key} scenarioKey={key} scenario={scenario} />
              ))}
            </div>
          </section>

          <section>
            <h3 className="text-base font-semibold text-[#323130] mb-4">Key Risks & Mitigations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {KEY_RISKS.map((risk) => (
                <RiskCard key={risk.id} risk={risk} />
              ))}
            </div>
          </section>
        </div>

        <div className="sticky bottom-0 flex items-center justify-between px-6 py-4 bg-white border-t border-[#EDEBE9]">
          <p className="text-[10px] text-[#605E5C]">
            Generated: January 15, 2025 | Model Version: 1.0.0
          </p>
          <button
            type="button"
            onClick={handleClose}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white rounded-md hover:bg-[#005a9e] focus:outline-none focus:ring-2 focus:ring-[#0070C0] focus:ring-offset-2 transition-colors"
            style={{ backgroundColor: COLORS.PRIMARY }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

PredictiveModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  className: PropTypes.string,
};