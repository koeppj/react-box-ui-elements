import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from 'notistack';
import logo from './logo.svg';
import './App.css';
import AppMain from './components/AppMain';
import { ConfigProvider } from './contexts/ConfigContext';

function App() {

  return (
    <SnackbarProvider maxSnack={3}>
      <AuthProvider>
        <ConfigProvider>
          <AppMain />
        </ConfigProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
