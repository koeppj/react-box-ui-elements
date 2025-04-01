import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import { AppBar, Toolbar, Typography, Box, CssBaseline, Drawer, List, ListItem, ListItemIcon, ListItemText, ListItemButton } from '@mui/material';
import { Dashboard, Folder, Group, Assessment, AccountCircle } from '@mui/icons-material';
import { AuthProvider } from './contexts/AuthContext';
import AppStatus from './components/AppStatus';
import { SnackbarProvider } from 'notistack';
import logo from './logo.svg';
import './App.css';
import OAuthCallback from './components/OAuthCallback';
import AppMain from './components/AppMain';

function App() {

  const drawerWidth = 240;

  return (
    <SnackbarProvider maxSnack={3}>
      <AuthProvider>
        <AppMain />
      </AuthProvider>
    </SnackbarProvider>
  );
}

export default App;
