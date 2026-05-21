import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useData } from '../../context/DataContext';
import { MetricCard } from '../MetricCard';
import { InsightPanel } from '../InsightPanel';
import { QuickActionBar } from '../QuickActionBar';
import { LoadingSpinner } from '../LoadingSpinner';
import { ErrorBoundary } from '../ErrorBoundary';
import { EmptyState } from '../EmptyState';

function MetricGroup({ title, metrics = [], className = '' }) {
  if (!metrics || metrics.length === 0) {
    return null;
  }

  return (
    <section className={className} aria-label={title}>
      <h3 className="text-base font-semibold text-[#323130] mb-4">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((metric) => (
          <MetricCard
            key={metric.id}
            title={metric.title}
            value={metric.value}
            prefix={metric.prefix}
            suffix={metric.suffix}
            trend={metric.trend}
            insight={metric.insight}
            category={metric.category}
          />
        ))}
      </div>
    </section>
  );
}

MetricGroup.propTypes = {
  title: PropTypes.string.isRequired,
  metrics: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
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
    })
  ),
  className: PropTypes.string,
};

export function RiskGovernance({ className = '' }) {
  const { data, isLoading, error } = useData();

  if (isLoading) {
    return <LoadingSpinner label="Loading risk & governance data..." className={className} />;
  }

  if (error) {
    return (
      <div className={`p-6 ${className}`} role="alert">
        <EmptyState
          title="Failed to load data"
          message={error}
          icon="⚠️"
        />
      </div>
    );
  }

  if (!data) {
    return (
      <div className={`p-6 ${className}`} role="status">
        <EmptyState
          title="No data available"
          message="Risk & governance data is not available at this time."
          icon="📭"
        />
      </div>
    );
  }

  const riskGovernance = data.riskGovernance;
  const metrics = riskGovernance?.metrics || [];

  return (
    <ErrorBoundary title="Risk & Governance Error" fallbackMessage="An error occurred while rendering the Risk & Governance tab.">
      <div className={`p-6 space-y-8 ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <MetricGroup
              title="Risk & Governance Metrics"
              metrics={metrics}
            />
          </div>

          <div className="space-y-6">
            <InsightPanel
              confidence="high"
              strategicPriorities={[
                'Maintain compliance score above 95% through continuous monitoring and automated controls.',
                'Advance cybersecurity maturity to 90+ by completing zero-trust architecture rollout.',
              ]}
              executiveActions={[
                { id: 'rg-ea-1', label: 'Compliance Review', icon: '✅' },
                { id: 'rg-ea-2', label: 'Security Assessment', icon: '🛡️' },
              ]}
              insightBoxes={[
                {
                  id: 'rg-insight-1',
                  title: 'Compliance & Governance',
                  narrative: 'Compliance Score remains strong at 96.2% with GDPR and SOX requirements fully met. Data Governance Score improved to 94.8% as data classification coverage expanded across all datasets. Business Continuity Readiness holds steady at 99.1% with all regions passing DR testing.',
                  metrics: {
                    compliance: '96.2%',
                    dataGovernance: '94.8%',
                    bcReadiness: '99.1%',
                  },
                },
                {
                  id: 'rg-insight-2',
                  title: 'Cybersecurity Posture',
                  narrative: 'Cybersecurity Maturity reached 87/100 with NIST framework implementation progressing ahead of schedule. Vendor Risk Score improved to 87.4% following reassessment of top 20 vendors. Data sovereignty compliance maintained at 94.8% with EU data residency requirements fully met.',
                  metrics: {
                    maturity: '87/100',
                    vendorRisk: '87.4%',
                    dataSovereignty: '94.8%',
                  },
                },
              ]}
              title="Risk Intelligence"
            />

            <QuickActionBar
              actions={[
                { id: 'rg-qa-1', label: 'Compliance Deep Dive', variant: 'primary' },
                { id: 'rg-qa-2', label: 'Security Roadmap', variant: 'secondary' },
                { id: 'rg-qa-3', label: 'Vendor Risk Review', variant: 'secondary' },
              ]}
              title="Recommended Actions"
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

RiskGovernance.propTypes = {
  className: PropTypes.string,
};

export default RiskGovernance;