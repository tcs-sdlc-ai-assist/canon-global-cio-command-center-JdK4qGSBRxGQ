import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MetricCard } from './MetricCard';

describe('MetricCard', () => {
  it('renders title and value', () => {
    render(<MetricCard title="Revenue" value={2400000000} />);
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(screen.getByText('2,400,000,000')).toBeInTheDocument();
  });

  it('renders prefix and suffix with value', () => {
    render(<MetricCard title="Revenue" value={2.4} prefix="€" suffix="B" />);
    expect(screen.getByText('€')).toBeInTheDocument();
    expect(screen.getByText('2.4')).toBeInTheDocument();
    expect(screen.getByText('B')).toBeInTheDocument();
  });

  it('renders trend indicator with up direction', () => {
    render(
      <MetricCard
        title="Revenue"
        value={2.4}
        trend={{ direction: 'up', percentage: 12.5, label: 'vs last quarter' }}
      />
    );
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
    expect(screen.getByText('vs last quarter')).toBeInTheDocument();
  });

  it('renders trend indicator with down direction', () => {
    render(
      <MetricCard
        title="Incidents"
        value={247}
        trend={{ direction: 'down', percentage: 12.3, label: 'vs last month' }}
      />
    );
    expect(screen.getByText('-12.3%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('renders trend indicator with stable direction', () => {
    render(
      <MetricCard
        title="Availability"
        value={99.97}
        trend={{ direction: 'stable', percentage: 0, label: 'vs last month' }}
      />
    );
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('vs last month')).toBeInTheDocument();
  });

  it('renders AI insight text', () => {
    render(
      <MetricCard
        title="Revenue"
        value={2.4}
        insight="Digital channels now contribute 42% of total attributed revenue."
      />
    );
    expect(
      screen.getByText('Digital channels now contribute 42% of total attributed revenue.')
    ).toBeInTheDocument();
  });

  it('renders AI pulse dot when insight is provided', () => {
    render(
      <MetricCard
        title="Revenue"
        value={2.4}
        insight="Digital channels now contribute 42% of total attributed revenue."
      />
    );
    expect(screen.getByLabelText('AI insight available')).toBeInTheDocument();
  });

  it('does not render AI pulse dot when insight is not provided', () => {
    render(<MetricCard title="Revenue" value={2.4} />);
    expect(screen.queryByLabelText('AI insight available')).not.toBeInTheDocument();
  });

  it('renders with category border color class', () => {
    const { container } = render(
      <MetricCard title="Revenue" value={2.4} category="business" />
    );
    expect(container.firstChild).toHaveClass('border-l-[#0070C0]');
  });

  it('renders with risk category border color', () => {
    const { container } = render(
      <MetricCard title="Risk Score" value={87} category="risk" />
    );
    expect(container.firstChild).toHaveClass('border-l-[#D13438]');
  });

  it('renders with operations category border color', () => {
    const { container } = render(
      <MetricCard title="Efficiency" value={94.7} category="operations" />
    );
    expect(container.firstChild).toHaveClass('border-l-[#107C10]');
  });

  it('renders with innovation category border color', () => {
    const { container } = render(
      <MetricCard title="AI Models" value={47} category="innovation" />
    );
    expect(container.firstChild).toHaveClass('border-l-[#FF8C00]');
  });

  it('renders with partnership category border color', () => {
    const { container } = render(
      <MetricCard title="SLA" value={98.7} category="partnership" />
    );
    expect(container.firstChild).toHaveClass('border-l-[#6264A7]');
  });

  it('renders with default business category when no category provided', () => {
    const { container } = render(<MetricCard title="Revenue" value={2.4} />);
    expect(container.firstChild).toHaveClass('border-l-[#0070C0]');
  });

  it('formats large numbers with locale formatting', () => {
    render(<MetricCard title="Revenue" value={2400000000} />);
    expect(screen.getByText('2,400,000,000')).toBeInTheDocument();
  });

  it('formats decimal numbers with maximum 2 fraction digits', () => {
    render(<MetricCard title="Availability" value={99.9745} />);
    expect(screen.getByText('99.97')).toBeInTheDocument();
  });

  it('renders string values directly', () => {
    render(<MetricCard title="Status" value="Excellent" />);
    expect(screen.getByText('Excellent')).toBeInTheDocument();
  });

  it('accepts className prop', () => {
    const { container } = render(
      <MetricCard title="Revenue" value={2.4} className="custom-class" />
    );
    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('has accessible role article', () => {
    render(<MetricCard title="Revenue" value={2.4} />);
    expect(screen.getByRole('article')).toBeInTheDocument();
  });

  it('has accessible label with title', () => {
    render(<MetricCard title="Revenue" value={2.4} />);
    expect(screen.getByLabelText('Metric card: Revenue')).toBeInTheDocument();
  });

  it('renders trend without label when label not provided', () => {
    render(
      <MetricCard
        title="Revenue"
        value={2.4}
        trend={{ direction: 'up', percentage: 12.5 }}
      />
    );
    expect(screen.getByText('+12.5%')).toBeInTheDocument();
  });

  it('renders trend without percentage when percentage not provided', () => {
    render(
      <MetricCard
        title="Revenue"
        value={2.4}
        trend={{ direction: 'up', label: 'vs last quarter' }}
      />
    );
    expect(screen.getByText('vs last quarter')).toBeInTheDocument();
  });

  it('does not render trend section when trend is not provided', () => {
    const { container } = render(<MetricCard title="Revenue" value={2.4} />);
    const trendElements = container.querySelectorAll('.text-xs.font-semibold');
    const trendTexts = Array.from(trendElements).filter(el =>
      el.textContent.includes('%')
    );
    expect(trendTexts.length).toBe(0);
  });

  it('does not render insight section when insight is not provided', () => {
    const { container } = render(<MetricCard title="Revenue" value={2.4} />);
    const insightElements = container.querySelectorAll('.text-xs.text-\\[#605E5C\\]');
    const insightTexts = Array.from(insightElements).filter(el =>
      el.textContent.includes('💡')
    );
    expect(insightTexts.length).toBe(0);
  });
});