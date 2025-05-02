import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { SnackbarProvider } from 'notistack';
import './App.css';
import AppMain from './components/AppMain';
import { ConfigProvider } from './contexts/ConfigContext';
import { IntlProvider } from 'react-intl';
import { messages } from "box-ui-elements/i18n/bundles/en-US";

function App() {

  return (
    <SnackbarProvider maxSnack={3}>
      <AuthProvider>
        <ConfigProvider>
          <IntlProvider locale="en-US" messages={messages}>
            <AppMain />
          </IntlProvider>
        </ConfigProvider>
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
