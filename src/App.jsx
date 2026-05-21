import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import { UIProvider } from './context/UIProvider';
import { LoginPage } from './components/LoginPage';
import { AppShell } from './components/AppShell';

function AuthenticatedApp() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  return (
    <DataProvider>
      <UIProvider>
        <AppShell />
      </UIProvider>
    </DataProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AuthenticatedApp />
    </AuthProvider>
  );
}