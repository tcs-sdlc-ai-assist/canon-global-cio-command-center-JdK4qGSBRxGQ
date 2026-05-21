import React, { createContext, useContext, useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const UIContext = createContext(null);

export function UIProvider({ children }) {
  const [chatDrawerOpen, setChatDrawerOpen] = useState(false);
  const [chatInputPrefill, setChatInputPrefill] = useState('');
  const [toasts, setToasts] = useState([]);
  const [predictiveModalOpen, setPredictiveModalOpen] = useState(false);

  const toggleChatDrawer = useCallback(() => {
    setChatDrawerOpen((prev) => !prev);
  }, []);

  const openChatDrawer = useCallback(() => {
    setChatDrawerOpen(true);
  }, []);

  const closeChatDrawer = useCallback(() => {
    setChatDrawerOpen(false);
  }, []);

  const addToast = useCallback((toast) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);

    const duration = toast.duration || 4000;
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const openPredictiveModal = useCallback(() => {
    setPredictiveModalOpen(true);
  }, []);

  const closePredictiveModal = useCallback(() => {
    setPredictiveModalOpen(false);
  }, []);

  return (
    <UIContext.Provider
      value={{
        chatDrawerOpen,
        toggleChatDrawer,
        openChatDrawer,
        closeChatDrawer,
        chatInputPrefill,
        setChatInputPrefill,
        toasts,
        addToast,
        removeToast,
        predictiveModalOpen,
        openPredictiveModal,
        closePredictiveModal,
      }}
    >
      {children}
    </UIContext.Provider>
  );
}

UIProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}