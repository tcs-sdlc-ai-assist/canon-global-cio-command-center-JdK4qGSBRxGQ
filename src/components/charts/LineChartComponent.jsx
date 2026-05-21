import React from 'react';
import PropTypes from 'prop-types';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CHART_MARGINS,
  CHART_GRID,
  CHART_AXIS,
  CHART_TOOLTIP,
  CHART_LEGEND,
  CHART_ANIMATION,
  LINE_DOT,
} from '../../chart.config';
import { EmptyState } from '../EmptyState';

export function LineChartComponent({ data, options = {} }) {
  const {
    xKey = 'name',
    datasets = [],
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    height,
  } = options;

  if (!data || data.length === 0) {
    return <EmptyState title="No chart data" message="No data available for this chart." />;
  }

  if (!datasets || datasets.length === 0) {
    return <EmptyState title="No datasets" message="No datasets configured for this chart." />;
  }

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <LineChart data={data} margin={CHART_MARGINS}>
        {showGrid && <CartesianGrid {...CHART_GRID} />}
        <XAxis dataKey={xKey} {...CHART_AXIS} />
        <YAxis {...CHART_AXIS} />
        {showTooltip && <Tooltip {...CHART_TOOLTIP} />}
        {showLegend && <Legend {...CHART_LEGEND} />}
        {datasets.map((dataset, index) => (
          <Line
            key={dataset.name || index}
            type="monotone"
            dataKey={dataset.dataKey || 'value'}
            name={dataset.name}
            stroke={dataset.color}
            strokeWidth={2}
            dot={dataset.dot !== false ? { ...LINE_DOT, fill: dataset.color, stroke: dataset.color } : false}
            activeDot={{ r: 6, fill: dataset.color, stroke: '#fff', strokeWidth: 2 }}
            {...CHART_ANIMATION}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

LineChartComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    xKey: PropTypes.string,
    datasets: PropTypes.arrayOf(
      PropTypes.shape({
        name: PropTypes.string,
        dataKey: PropTypes.string,
        color: PropTypes.string,
        dot: PropTypes.bool,
      })
    ),
    showGrid: PropTypes.bool,
    showLegend: PropTypes.bool,
    showTooltip: PropTypes.bool,
    height: PropTypes.number,
  }),
};