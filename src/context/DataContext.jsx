import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const DataContext = createContext(null);

export function DataProvider({ children }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [
        strategicCommandModule,
        executiveSummaryModule,
        businessImpactModule,
        operationsModule,
        riskGovernanceModule,
        innovationModule,
        partnershipsModule,
      ] = await Promise.all([
        import('../data/strategic-command.json'),
        import('../data/executive-summary.json'),
        import('../data/business-impact.json'),
        import('../data/operations.json'),
        import('../data/risk-governance.json'),
        import('../data/innovation.json'),
        import('../data/partnerships.json'),
      ]);

      setData({
        strategicCommand: strategicCommandModule.default,
        executiveSummary: executiveSummaryModule.default,
        businessImpact: businessImpactModule.default,
        operations: operationsModule.default,
        riskGovernance: riskGovernanceModule.default,
        innovation: innovationModule.default,
        partnerships: partnershipsModule.default,
      });
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError('Failed to load dashboard data. Please try refreshing the page.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const retry = useCallback(() => {
    loadData();
  }, [loadData]);

  return (
    <DataContext.Provider value={{ data, isLoading, error, retry }}>
      {children}
    </DataContext.Provider>
  );
}

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}