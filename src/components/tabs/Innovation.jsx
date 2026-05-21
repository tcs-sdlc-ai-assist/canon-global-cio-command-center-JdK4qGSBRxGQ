import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useData } from '../../context/DataContext';
import { MetricCard } from '../MetricCard';
import { ChartWrapper } from '../charts/ChartWrapper';
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

function PortfolioChart({ data }) {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return <EmptyState title="No portfolio data" message="Innovation portfolio distribution data is not available." />;
  }

  const chartOptions = {
    nameKey: 'name',
    valueKey: 'value',
    colors: data.map((item) => item.color).filter(Boolean),
    showLegend: true,
    showTooltip: true,
    height: 300,
  };

  return (
    <section aria-label="Innovation portfolio distribution chart">
      <h3 className="text-base font-semibold text-[#323130] mb-4">Innovation Portfolio Distribution</h3>
      <div className="bg-white rounded-lg border border-[#EDEBE9] shadow-sm p-4">
        <ChartWrapper
          chartType="doughnut"
          data={data}
          options={chartOptions}
          title="Portfolio Distribution by Category"
        />
      </div>
    </section>
  );
}

PortfolioChart.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      value: PropTypes.number.isRequired,
      color: PropTypes.string,
    })
  ),
};

export function Innovation({ className = '' }) {
  const { data, isLoading, error } = useData();

  if (isLoading) {
    return <LoadingSpinner label="Loading innovation data..." className={className} />;
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
          message="Innovation data is not available at this time."
          icon="📭"
        />
      </div>
    );
  }

  const innovation = data.innovation;
  const metrics = innovation?.metrics || [];
  const portfolioDistribution = innovation?.portfolioDistribution || [];

  return (
    <ErrorBoundary title="Innovation Error" fallbackMessage="An error occurred while rendering the Innovation tab.">
      <div className={`p-6 space-y-8 ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <MetricGroup
              title="Innovation Metrics"
              metrics={metrics}
            />

            <PortfolioChart data={portfolioDistribution} />
          </div>

          <div className="space-y-6">
            <InsightPanel
              confidence="high"
              strategicPriorities={[
                'Scale AI/ML model deployment from 47 to 85 production models by end of year.',
                'Expand innovation pipeline value through strategic partnerships and quantum computing pilots.',
              ]}
              executiveActions={[
                { id: 'inn-ea-1', label: 'AI/ML Roadmap', icon: '🤖' },
                { id: 'inn-ea-2', label: 'Pipeline Review', icon: '📋' },
              ]}
              insightBoxes={[
                {
                  id: 'inn-insight-1',
                  title: 'AI/ML Momentum',
                  narrative: 'AI/ML models in production grew 23.7% this quarter with 12 new deployments across supply chain and customer service. The AI Center of Excellence now has 85 data scientists, driving a maturity score of 7.2/10. AI/ML represents 35% of the innovation portfolio.',
                  metrics: {
                    models: '47',
                    growth: '23.7%',
                    maturity: '7.2/10',
                    dataScientists: '85',
                  },
                },
                {
                  id: 'inn-insight-2',
                  title: 'Innovation Pipeline & IP',
                  narrative: 'Innovation pipeline value reached €47.3M with 8 projects in validation phase worth €12M combined. Patent applications increased 35.3% to 23 filings, with AI/ML-related patents accounting for 60% of new filings. Skills readiness improved to 8.4/10 with 82% of IT staff completing cloud certification.',
                  metrics: {
                    pipelineValue: '€47.3M',
                    patents: '23',
                    skillsReadiness: '8.4/10',
                    cloudCertified: '82%',
                  },
                },
              ]}
              title="Innovation Intelligence"
            />

            <QuickActionBar
              actions={[
                { id: 'inn-qa-1', label: 'AI/ML Deep Dive', variant: 'primary' },
                { id: 'inn-qa-2', label: 'Patent Portfolio Review', variant: 'secondary' },
                { id: 'inn-qa-3', label: 'Sustainability Initiatives', variant: 'secondary' },
              ]}
              title="Recommended Actions"
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

Innovation.propTypes = {
  className: PropTypes.string,
};

export default Innovation;