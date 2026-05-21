import React from 'react';
import PropTypes from 'prop-types';
import {
  ComposedChart,
  Bar,
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
  CHART_COLORS,
  BAR_SIZE,
  LINE_DOT,
} from '../../chart.config';
import { EmptyState } from '../EmptyState';

export function DualAxisChartComponent({ data, options = {} }) {
  const {
    xKey = 'name',
    leftYKey = 'value',
    rightYKey = 'value2',
    leftColor,
    rightColor,
    showGrid = true,
    showLegend = true,
    showTooltip = true,
    height,
  } = options;

  if (!data || data.length === 0) {
    return <EmptyState title="No chart data" message="No data available for this chart." />;
  }

  const barColor = leftColor || CHART_COLORS.primary;
  const lineColor = rightColor || CHART_COLORS.secondary;

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <ComposedChart data={data} margin={CHART_MARGINS}>
        {showGrid && <CartesianGrid {...CHART_GRID} />}
        <XAxis dataKey={xKey} {...CHART_AXIS} />
        <YAxis yAxisId="left" {...CHART_AXIS} />
        <YAxis yAxisId="right" orientation="right" {...CHART_AXIS} />
        {showTooltip && <Tooltip {...CHART_TOOLTIP} />}
        {showLegend && <Legend {...CHART_LEGEND} />}
        <Bar
          yAxisId="left"
          dataKey={leftYKey}
          fill={barColor}
          barSize={BAR_SIZE}
          radius={[4, 4, 0, 0]}
          {...CHART_ANIMATION}
        />
        <Line
          yAxisId="right"
          type="monotone"
          dataKey={rightYKey}
          stroke={lineColor}
          strokeWidth={2}
          dot={{ ...LINE_DOT, fill: lineColor, stroke: lineColor }}
          activeDot={{ r: 6, fill: lineColor, stroke: '#fff', strokeWidth: 2 }}
          {...CHART_ANIMATION}
        />
      </ComposedChart>
    </ResponsiveContainer>
  );
}

DualAxisChartComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    xKey: PropTypes.string,
    leftYKey: PropTypes.string,
    rightYKey: PropTypes.string,
    leftColor: PropTypes.string,
    rightColor: PropTypes.string,
    showGrid: PropTypes.bool,
    showLegend: PropTypes.bool,
    showTooltip: PropTypes.bool,
    height: PropTypes.number,
  }),
};