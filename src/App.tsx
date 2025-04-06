import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from 'notistack';
import logo from './logo.svg';
import './App.css';
import AppMain from './components/AppMain';
import { ConfigProvider } from './contexts/ConfigContext';
import { IntlProvider } from 'react-intl';

function App() {

  return (
    <SnackbarProvider maxSnack={3}>
      <AuthProvider>
        <ConfigProvider>
          <IntlProvider locale="en">
            <AppMain />
          </IntlProvider>
        </ConfigProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
