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

function ValueCreationChart({ data }) {
  if (!data || !data.categories || !data.values) {
    return <EmptyState title="No chart data" message="Value creation chart data is not available." />;
  }

  const chartData = useMemo(() => {
    return data.categories.map((category, index) => ({
      name: category,
      value: data.values[index] || 0,
    }));
  }, [data]);

  const chartOptions = {
    xKey: 'name',
    yKey: 'value',
    showGrid: true,
    showLegend: false,
    showTooltip: true,
    height: 300,
    color: '#4F46E5',
  };

  return (
    <section aria-label="IT business value creation chart">
      <h3 className="text-base font-semibold text-[#323130] mb-4">IT Business Value Creation</h3>
      <div className="bg-white rounded-lg border border-[#EDEBE9] shadow-sm p-4">
        <ChartWrapper
          chartType="bar"
          data={chartData}
          options={chartOptions}
          title="Value Creation by Category (€ millions)"
        />
      </div>
    </section>
  );
}

ValueCreationChart.propTypes = {
  data: PropTypes.shape({
    categories: PropTypes.arrayOf(PropTypes.string),
    values: PropTypes.arrayOf(PropTypes.number),
    unit: PropTypes.string,
  }),
};

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

export function BusinessImpact({ className = '' }) {
  const { data, isLoading, error } = useData();

  if (isLoading) {
    return <LoadingSpinner label="Loading business impact data..." className={className} />;
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
          message="Business impact data is not available at this time."
          icon="📭"
        />
      </div>
    );
  }

  const businessImpact = data.businessImpact;
  const metrics = businessImpact?.metrics || [];
  const valueCreationChart = businessImpact?.valueCreationChart;

  return (
    <ErrorBoundary title="Business Impact Error" fallbackMessage="An error occurred while rendering the Business Impact tab.">
      <div className={`p-6 space-y-8 ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <MetricGroup
              title="Business Value Metrics"
              metrics={metrics}
            />

            <ValueCreationChart data={valueCreationChart} />
          </div>

          <div className="space-y-6">
            <InsightPanel
              confidence="high"
              strategicPriorities={[
                'Accelerate digital channel expansion to increase revenue attribution beyond 42%.',
                'Scale automation initiatives to drive additional cost avoidance in finance and HR.',
              ]}
              executiveActions={[
                { id: 'bi-ea-1', label: 'Revenue Deep Dive', icon: '📊' },
                { id: 'bi-ea-2', label: 'Cost Optimization', icon: '💰' },
              ]}
              insightBoxes={[
                {
                  id: 'bi-insight-1',
                  title: 'Revenue Growth Drivers',
                  narrative: 'Digital channels now contribute 42% of total attributed revenue. APAC expansion and AI-driven sales optimization are the primary growth drivers this quarter.',
                  metrics: {
                    digitalShare: '42%',
                    growthRate: '+12.5%',
                    topRegion: 'APAC',
                  },
                },
                {
                  id: 'bi-insight-2',
                  title: 'Cost Optimization Impact',
                  narrative: 'Automation initiatives drove €24M in additional savings this quarter. RPA and AIOps are the largest contributors to cost avoidance, with finance and HR processes showing the highest ROI.',
                  metrics: {
                    totalSavings: '€24M',
                    automationROI: '340%',
                    topDomain: 'Finance',
                  },
                },
              ]}
              title="Business Intelligence"
            />

            <QuickActionBar
              actions={[
                { id: 'bi-qa-1', label: 'Revenue Attribution Analysis', variant: 'primary' },
                { id: 'bi-qa-2', label: 'Cost Avoidance Review', variant: 'secondary' },
                { id: 'bi-qa-3', label: 'Innovation ROI Deep Dive', variant: 'secondary' },
              ]}
              title="Recommended Actions"
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

BusinessImpact.propTypes = {
  className: PropTypes.string,
};

export default BusinessImpact;