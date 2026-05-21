import React from 'react';
import PropTypes from 'prop-types';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  CHART_MARGINS,
  CHART_TOOLTIP,
  CHART_LEGEND,
  CHART_ANIMATION,
  CHART_COLORS,
  DONUT_INNER_RATIO,
} from '../../chart.config';
import { EmptyState } from '../EmptyState';

export function DoughnutChartComponent({ data, options = {} }) {
  const {
    nameKey = 'name',
    valueKey = 'value',
    colors,
    showLegend = true,
    showTooltip = true,
    height,
    innerRadius,
  } = options;

  if (!data || data.length === 0) {
    return <EmptyState title="No chart data" message="No data available for this chart." />;
  }

  const chartColors = colors || CHART_COLORS.categorical;

  return (
    <ResponsiveContainer width="100%" height={height || 300}>
      <PieChart margin={CHART_MARGINS}>
        {showTooltip && <Tooltip {...CHART_TOOLTIP} />}
        {showLegend && <Legend {...CHART_LEGEND} />}
        <Pie
          data={data}
          nameKey={nameKey}
          dataKey={valueKey}
          cx="50%"
          cy="50%"
          innerRadius={innerRadius || `${DONUT_INNER_RATIO * 50}%`}
          outerRadius="80%"
          paddingAngle={2}
          {...CHART_ANIMATION}
        >
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.color || chartColors[index % chartColors.length]}
              stroke="transparent"
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

DoughnutChartComponent.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  options: PropTypes.shape({
    nameKey: PropTypes.string,
    valueKey: PropTypes.string,
    colors: PropTypes.arrayOf(PropTypes.string),
    showLegend: PropTypes.bool,
    showTooltip: PropTypes.bool,
    height: PropTypes.number,
    innerRadius: PropTypes.string,
  }),
};