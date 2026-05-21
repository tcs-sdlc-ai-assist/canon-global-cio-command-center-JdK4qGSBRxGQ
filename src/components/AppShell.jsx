import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { Header } from './Header';
import { TabNavigation } from './TabNavigation';
import { TabContentRenderer } from './TabContentRenderer';
import { AIChatDrawer } from './chat/AIChatDrawer';
import { ToastContainer } from './ToastContainer';
import { PredictiveModal } from './PredictiveModal';
import { useUI } from '../context/UIProvider';
import { DEFAULT_TAB_ID, NAVIGATION } from '../app.config';

export function AppShell({ className = '' }) {
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB_ID);
  const { predictiveModalOpen, closePredictiveModal } = useUI();

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  return (
    <div className={`min-h-screen bg-[#F3F2F1] ${className}`}>
      <Header />

      <div
        className="fixed left-0 right-0 z-40"
        style={{ top: NAVIGATION.HEADER_HEIGHT }}
      >
        <TabNavigation
          activeTab={activeTab}
          onTabChange={handleTabChange}
        />
      </div>

      <main
        className="pt-0"
        style={{
          marginTop: NAVIGATION.HEADER_HEIGHT + 48,
          minHeight: `calc(100vh - ${NAVIGATION.HEADER_HEIGHT}px)`,
        }}
        role="main"
      >
        <TabContentRenderer
          activeTab={activeTab}
          className="w-full"
        />
      </main>

      <AIChatDrawer />
      <ToastContainer />
      <PredictiveModal
        isOpen={predictiveModalOpen}
        onClose={closePredictiveModal}
      />
    </div>
  );
}

AppShell.propTypes = {
  className: PropTypes.string,
};

export default AppShell;