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

function IncidentTrendsChart({ data }) {
  if (!data || !data.months || !data.incidents || !data.mttr) {
    return <EmptyState title="No trend data" message="Incident trend data is not available." />;
  }

  const chartData = useMemo(() => {
    return data.months.map((month, index) => ({
      name: month,
      incidents: data.incidents[index] || 0,
      mttr: data.mttr[index] || 0,
    }));
  }, [data]);

  const chartOptions = {
    xKey: 'name',
    leftYKey: 'incidents',
    rightYKey: 'mttr',
    leftColor: '#D13438',
    rightColor: '#0070C0',
    showGrid: true,
    showLegend: true,
    showTooltip: true,
    height: 300,
  };

  return (
    <section aria-label="Incident trends chart">
      <h3 className="text-base font-semibold text-[#323130] mb-4">Incident Trends (Year-to-Date)</h3>
      <div className="bg-white rounded-lg border border-[#EDEBE9] shadow-sm p-4">
        <ChartWrapper
          chartType="dual-axis"
          data={chartData}
          options={chartOptions}
          title="Incidents vs MTTR (hours)"
        />
      </div>
    </section>
  );
}

IncidentTrendsChart.propTypes = {
  data: PropTypes.shape({
    months: PropTypes.arrayOf(PropTypes.string),
    incidents: PropTypes.arrayOf(PropTypes.number),
    mttr: PropTypes.arrayOf(PropTypes.number),
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

export function Operations({ className = '' }) {
  const { data, isLoading, error } = useData();

  if (isLoading) {
    return <LoadingSpinner label="Loading operations data..." className={className} />;
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
          message="Operations data is not available at this time."
          icon="📭"
        />
      </div>
    );
  }

  const operations = data.operations;
  const metrics = operations?.metrics || [];
  const incidentTrends = operations?.incidentTrends;

  return (
    <ErrorBoundary title="Operations Error" fallbackMessage="An error occurred while rendering the Operations tab.">
      <div className={`p-6 space-y-8 ${className}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-8">
            <MetricGroup
              title="Operations Metrics"
              metrics={metrics}
            />

            <IncidentTrendsChart data={incidentTrends} />
          </div>

          <div className="space-y-6">
            <InsightPanel
              confidence="high"
              strategicPriorities={[
                'Continue incident reduction trajectory through proactive monitoring and AI-driven triage.',
                'Maintain system availability above 99.95% SLA target with infrastructure redundancy upgrades.',
              ]}
              executiveActions={[
                { id: 'ops-ea-1', label: 'Incident Review', icon: '🔍' },
                { id: 'ops-ea-2', label: 'Infrastructure Plan', icon: '🖥️' },
              ]}
              insightBoxes={[
                {
                  id: 'ops-insight-1',
                  title: 'Incident Reduction Drivers',
                  narrative: 'Total incidents decreased 12.3% month-over-month, driven by proactive monitoring improvements and automated triage. Mean Time to Resolve improved 18.5% to 4.2 hours, with AI-assisted root cause analysis reducing diagnosis time by 35%.',
                  metrics: {
                    incidentsMTD: '247',
                    mttr: '4.2 hours',
                    reduction: '12.3%',
                  },
                },
                {
                  id: 'ops-insight-2',
                  title: 'Infrastructure Efficiency',
                  narrative: 'Infrastructure efficiency reached 94.7% with cloud optimization reducing costs by 15%. Global IT Health Score improved to 92/100 with all regions reporting above the 85 threshold. System availability exceeded 99.95% SLA for 6 consecutive months.',
                  metrics: {
                    efficiency: '94.7%',
                    healthScore: '92/100',
                    availability: '99.97%',
                  },
                },
              ]}
              title="Operations Intelligence"
            />

            <QuickActionBar
              actions={[
                { id: 'ops-qa-1', label: 'Incident Trend Analysis', variant: 'primary' },
                { id: 'ops-qa-2', label: 'Infrastructure Review', variant: 'secondary' },
                { id: 'ops-qa-3', label: 'Security Posture Deep Dive', variant: 'secondary' },
              ]}
              title="Recommended Actions"
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}

Operations.propTypes = {
  className: PropTypes.string,
};

export default Operations;